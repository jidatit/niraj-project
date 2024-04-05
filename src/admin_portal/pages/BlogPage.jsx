import React, { useState } from 'react';
import { TextField } from '@mui/material';
import Button from '../components/Button';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addDoc, collection } from 'firebase/firestore';
import { db, storage } from '../../../db';
import { ref, uploadBytes, getDownloadURL } from '@firebase/storage';

const BlogPage = () => {
    const [buttonText, setButtonText] = useState("Publish");
    const [selectedAuthorImageData, setSelectedAuthorImageData] = useState(null);
    const [selectedBlogImageData, setSelectedBlogImageData] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        topic: '',
        author_name: '',
        preview_text: '',
        MainImageUrl: '',
        authorImageUrl: '',
        dynamicContent: [{ heading: '', paragraph: '' }],
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleAddContent = () => {
        setFormData((prevData) => ({
            ...prevData,
            dynamicContent: [...prevData.dynamicContent, { heading: '', paragraph: '' }],
        }));
    };

    const handleDynamicContentChange = (index, type, value) => {
        const updatedContent = [...formData.dynamicContent];
        updatedContent[index][type] = value;
        setFormData((prevData) => ({
            ...prevData,
            dynamicContent: updatedContent,
        }));
    };

    const handleAuthorImageSelect = (event) => {
        const file = event.target.files[0];
        setSelectedAuthorImageData(file);
    };

    const handleBlogImageSelect = (event) => {
        const file = event.target.files[0];
        setSelectedBlogImageData(file);
    };

    const addblogtodb = async () => {
        try {
            if (!selectedAuthorImageData || !selectedBlogImageData) {
                toast.warn("Fill Details")
                return
            }
            setButtonText("Publishing");
            let formDataCopy = { ...formData };

            if (selectedAuthorImageData) {
                const authorImageRef = ref(storage, `blogs/${formData.author_name}_author_image`);
                await uploadBytes(authorImageRef, selectedAuthorImageData);
                const authorImageUrl = await getDownloadURL(authorImageRef);
                formDataCopy.authorImageUrl = authorImageUrl;
            }

            if (selectedBlogImageData) {
                const blogImageRef = ref(storage, `blogs/${formData.title}_blog_image`);
                await uploadBytes(blogImageRef, selectedBlogImageData);
                const blogImageUrl = await getDownloadURL(blogImageRef);
                formDataCopy.MainImageUrl = blogImageUrl;
            }

            await addDoc(collection(db, 'blogs'), formDataCopy);
            toast.success('Blog added successfully!');
            setButtonText("Publish");
        } catch (error) {
            toast.error('Error occurred');
        }
    };

    return (
        <>
            <div className="w-full flex flex-col bg-[#FAFAFA] justify-center items-center">
                <ToastContainer />
                <div className="w-[90%] flex flex-col justify-center items-start">
                    <h1 className="text-black font-bold text-[25px] mt-5 mb-5">Blogs</h1>
                </div>

                <div className="w-[90%] gap-4 pt-5 mb-10 bg-white flex flex-col justify-center items-center rounded-md shadow-lg">
                    <TextField required label="Enter Blog Title" type="text" onChange={handleChange} name="title" value={formData.title} className="w-[70%]" />
                    <TextField required label="Enter Blog Topic" type="text" onChange={handleChange} name="topic" value={formData.topic} className="w-[70%]" />
                    <TextField required label="Name of Author" type="text" onChange={handleChange} name="author_name" value={formData.author_name} className="w-[70%]" />
                    <TextField required label="Preview Text" type="text" onChange={handleChange} name="preview_text" value={formData.preview_text} className="w-[70%]" />

                    <label
                        className="bg-transparent group w-[70%] hover:bg-gray-700 border-black border-[1px] rounded-lg text-white text-sm px-4 py-2.5 outline-none cursor-pointer mx-auto block font-[sans-serif]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 mr-2 group-hover:fill-white fill-black inline" viewBox="0 0 32 32">
                            <path
                                d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                                data-original="#000000" />
                            <path
                                d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                                data-original="#000000" />
                        </svg>
                        <span className='text-black group-hover:text-white'>{"Upload Author Image"}</span>
                        <input type="file" accept="image/*" onChange={handleAuthorImageSelect} className="hidden" />
                        {selectedAuthorImageData && <img className="mt-4 mx-auto max-w-full" src={selectedAuthorImageData} />}
                    </label>

                    {formData.dynamicContent.map((content, index) => (
                        <div className="w-[70%] flex flex-col justify-center items-center gap-2" key={index}>
                            <TextField
                                label={`Heading ${index + 1}`}
                                value={content.heading}
                                onChange={(e) => handleDynamicContentChange(index, 'heading', e.target.value)}
                                className="w-full mt-2 mb-5"
                            />
                            <TextField
                                label={`Paragraph ${index + 1}`}
                                value={content.paragraph}
                                onChange={(e) => handleDynamicContentChange(index, 'paragraph', e.target.value)}
                                multiline
                                rows={4}
                                className="w-full mb-5"
                            />
                        </div>
                    ))}

                    <div className="w-[10%]">
                        <Button onClickProp={handleAddContent} text="+" />
                    </div>

                    <label
                        className="bg-transparent group w-[70%] hover:bg-gray-700 border-black border-[1px] rounded-lg text-white text-sm px-4 py-2.5 outline-none cursor-pointer mx-auto block font-[sans-serif]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 mr-2 group-hover:fill-white fill-black inline" viewBox="0 0 32 32">
                            <path
                                d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                                data-original="#000000" />
                            <path
                                d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                                data-original="#000000" />
                        </svg>
                        <span className='text-black group-hover:text-white'>{"Upload Blog Image"}</span>
                        <input type="file" accept="image/*" onChange={handleBlogImageSelect} className="hidden" />
                        {selectedBlogImageData && <img className="mt-4 mx-auto max-w-full" src={selectedBlogImageData} />}
                    </label>

                    <div className="w-[90%] mb-5 flex flex-col justify-end items-end">
                        <div className="md:w-[30%] w-full pr-0 md:pr-2">
                            <Button onClickProp={addblogtodb} text={buttonText} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlogPage;
