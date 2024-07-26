import React, { useState, useEffect } from 'react';
import { CircularProgress, InputLabel, TextField } from '@mui/material';
import { db, storage } from '../../../db';
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { formatDate, getType } from '../../utils/helperSnippets';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
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
                        setDocumentData({ id: docSnap.id, ...docSnap.data() });
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

                const remindersCollectionRef = collection(db, "reminders");
                const q = query(remindersCollectionRef, where("req_qid", "==", id));

                const querySnapshot = await getDocs(q);
                querySnapshot.forEach(async (doc) => {
                    const reminderDocRef = doc.ref;
                    await updateDoc(reminderDocRef, {
                        fulfilled: true
                    });
                });

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

    const renderTextField = (label, value) => (
        <div className='flex w-full flex-col justify-center items-start gap-2'>
            <InputLabel htmlFor="name">{label}</InputLabel>
            <TextField
                className='w-full'
                id="name"
                label={label}
                variant="outlined"
                value={value}
                disabled
            />
        </div>
    );

    const renderDateField = (label, value) => (
        <div className='flex w-full flex-col justify-center items-start gap-2'>
            <InputLabel htmlFor="dateOfBirth">{label} <span className='text-xs'>(DD-MM-YYYY)</span></InputLabel>
            <TextField
                className='w-full'
                id="dateOfBirth"
                label={label}
                variant="outlined"
                value={formatDate(value)}
                disabled
            />
        </div>
    );

    return (
        <>
            <Container className="min-h-screen flex flex-col justify-center items-center">
                <ToastContainer />
                {loading ? (
                    <div className='flex flex-col justify-center items-center w-full'>
                        <CircularProgress color="primary" />
                    </div>
                ) : documentData?.files.length === 0 ? (
                    <>
                        <div className='w-full flex flex-col justify-center p-4 items-start shadow-lg rounded-lg'>
                            <Typography variant="h6">
                                <span className='font-semibold'>Note: Your Requested Quote for type: </span>{documentData.policyType} <span className='font-semibold'>with Id: </span> {documentData.id} cannot be processed further until you have submit required Inspections with it.
                            </Typography>

                            <Typography sx={{ marginTop: "20px", marginBottom: '20px' }} variant="h6">
                                <span className='font-semibold'>Status: </span>
                                <span className={"font-extrabold text-red-600"}>
                                    {documentData.status}
                                </span>
                            </Typography>

                            {documentData.persons && documentData.persons.map((person, index) => (
                                <React.Fragment key={`person-${index}`}>
                                    <div className='w-full flex flex-col justify-center items-start'>
                                        <p className='font-bold text-[17px]'>Person {index + 1}</p>
                                    </div>
                                    <div className='w-full grid grid-cols-1 mt-[10px] mb-[20px] lg:grid-cols-2 gap-5 justify-center items-center'>
                                        {person.name && renderTextField(`Name to be Insured ${index + 1}`, person.name)}
                                        {person.dob && renderDateField(`Date of Birth ${index + 1}`, person.dob)}
                                        {person.email && renderTextField(`Email ${index + 1}`, person.email)}
                                        {person.phoneNumber && renderTextField(`Phone Number ${index + 1}`, person.phoneNumber)}
                                    </div>
                                </React.Fragment>
                            ))}

                            {documentData.drivers && documentData.drivers.map((driver, index) => (
                                <React.Fragment key={`driver-${index}`}>
                                    <div className='w-full flex flex-col justify-center items-start'>
                                        <p className='font-bold text-[17px]'>Driver {index + 1}</p>
                                    </div>
                                    <div className='w-full grid grid-cols-1 mt-[10px] mb-[20px] lg:grid-cols-2 gap-5 justify-center items-center'>
                                        {driver.name && renderTextField(`Driver Name ${index + 1}`, driver.name)}
                                        {driver.dob && renderDateField(`Driver Date of Birth ${index + 1}`, driver.dob)}
                                        {driver.email && renderTextField(`Driver Email ${index + 1}`, driver.email)}
                                        {driver.phoneNumber && renderTextField(`Driver Phone Number ${index + 1}`, driver.phoneNumber)}
                                        {driver.LN && renderTextField(`Driver License Number ${index + 1}`, driver.LN)}
                                    </div>
                                </React.Fragment>
                            ))}

                            {documentData.address && renderTextField("Address to be insured", documentData.address)}

                            {documentData.drivers && documentData.mailingAddress && renderTextField("Address to be insured", documentData.mailingAddress)}

                            <Typography sx={{ marginTop: "20px" }} variant="h6">
                                <span className='font-semibold'>Upload Files</span>
                            </Typography>

                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                                id="file-upload"
                            />
                            <label htmlFor="file-upload">
                                <Button sx={{ marginTop: "20px", marginBottom: "20px" }} variant="contained" color="primary" component="span">
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
                        </div>

                    </>
                ) : (
                    <>
                        <div className='w-full flex-col flex justify-center items-center'>
                            <p className='font-semibold'>Inspections already uploaded.</p>
                            <Link to={"/user_portal"}>
                                <p className='underline'>Click to go back</p>
                            </Link>
                        </div>
                    </>
                )}
            </Container>
        </>
    );
};

export default UploadInspections;