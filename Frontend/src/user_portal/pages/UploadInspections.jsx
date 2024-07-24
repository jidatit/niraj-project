import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import { db, storage } from '../../../db';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getType } from '../../utils/helperSnippets';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Button, Typography, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import 'react-toastify/dist/ReactToastify.css';

const UploadInspections = () => {
    const navigate = useNavigate()
    const [documentData, setDocumentData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchDocument = async () => {
            setLoading(true);
            try {
                const type = new URLSearchParams(window.location.search).get("type");
                const id = new URLSearchParams(window.location.search).get("id");
                if (type && id) {
                    const collection_ref = getType(type);
                    const docRef = doc(db, collection_ref, id);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setDocumentData(docSnap.data());
                    } else {
                        console.log("No such document!");
                    }
                }
            } catch (error) {
                console.error("Error fetching document:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDocument();
    }, []);

    const handleFileChange = (event) => {
        setFiles([...event.target.files]);
    };

    const handleRemoveFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        setUploading(true);
        try {
            const type = new URLSearchParams(window.location.search).get("type");
            const id = new URLSearchParams(window.location.search).get("id");
            const reminder_id = new URLSearchParams(window.location.search).get("r_id");

            const timestamp = Date.now();
            const uniqueId = Math.random().toString(36).substring(2);

            const uploadPromises = files.map(async (file) => {
                const storageRef = ref(storage, `${getType(type)}/${timestamp}_${uniqueId}_${file.name}`);
                await uploadBytes(storageRef, file);
                return getDownloadURL(storageRef);
            });

            const fileUrls = await Promise.all(uploadPromises);

            if (type && id) {
                const collection_ref = getType(type);
                const docRef = doc(db, collection_ref, id);

                await updateDoc(docRef, {
                    files: fileUrls.map(url => ({ file: url })),
                    status: "completed"
                });

                const reminderDocRef = doc(db, "reminders", reminder_id)

                await updateDoc(reminderDocRef, {
                    fulfilled: true
                })

                toast.success("Inspections uploaded.")
                setTimeout(() => {
                    navigate("/user_portal")
                }, 2000);
            }
        } catch (error) {
            console.error("Error uploading files:", error);
        } finally {
            setUploading(false);
        }
    };

    const renderFilePreview = (file) => {
        const fileUrl = URL.createObjectURL(file);
        if (file.type.startsWith('image/')) {
            return <img src={fileUrl} alt="Preview" className="w-full h-[100px] object-cover rounded" />;
        } else if (file.type === 'application/pdf') {
            return (
                <iframe
                    src={fileUrl}
                    title="PDF Preview"
                    className="w-full h-[100px] rounded"
                />
            );
        } else {
            return <Typography variant="body2">File type not supported for preview</Typography>;
        }
    };

    return (
        <>
            <Container className="min-h-screen flex flex-col justify-center items-center">
                <ToastContainer />
                {loading ? (
                    <CircularProgress color="primary" />
                ) : (
                    <>
                        <Typography variant="h4" gutterBottom>
                            Upload Files
                        </Typography>

                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            id="file-upload"
                        />
                        <label htmlFor="file-upload">
                            <Button sx={{ marginBottom: "20px" }} variant="contained" color="primary" component="span">
                                Select Files
                            </Button>
                        </label>

                        <Grid container spacing={2} className="mt-5 mb-5">
                            {files.length > 0 && (
                                <Grid item xs={12}>
                                    <Grid container spacing={2}>
                                        {files.map((file, index) => (
                                            <Grid item xs={4} sm={3} md={2} key={index}>
                                                <div className="flex flex-col justify-center items-center">
                                                    <p>{file.name}</p>
                                                    {renderFilePreview(file)}
                                                    <IconButton
                                                        color="secondary"
                                                        onClick={() => handleRemoveFile(index)}
                                                    >
                                                        <Delete />
                                                    </IconButton>
                                                </div>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Grid>
                            )}
                        </Grid>

                        {files.length > 0 && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                className="mt-4"
                                disabled={files.length === 0 || uploading}
                            >
                                {uploading ? (
                                    <CircularProgress size={24} />
                                ) : (
                                    'Submit'
                                )}
                            </Button>
                        )}
                    </>
                )}
            </Container>
        </>
    );
};

export default UploadInspections;