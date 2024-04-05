import React, { useState } from 'react'
import { TextField } from '@mui/material'
import Button from "../components/Button"
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import ImagePicker from '../components/ImagePicker';

const BlogPage = () => {

    const [selectedAuthorImageData, setSelectedAuthorImageData] = useState(null);
    const [selectedBlogImageData, setSelectedBlogImageData] = useState(null);

    const handleAuthorImageSelect = (imageData) => {
        setSelectedAuthorImageData(imageData);
    };

    const handleBlogImageSelect = (imageData) => {
        setSelectedBlogImageData(imageData);
    };

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
        setFormData(prevData => ({
            ...prevData,
            dynamicContent: [...prevData.dynamicContent, { heading: '', paragraph: '' }]
        }));
    };

    const handleDynamicContentChange = (index, type, value) => {
        const updatedContent = [...formData.dynamicContent];
        updatedContent[index][type] = value;
        setFormData(prevData => ({
            ...prevData,
            dynamicContent: updatedContent
        }));
    };

    return (
        <>
            <div className='w-full flex flex-col bg-[#FAFAFA] justify-center items-center'>
                <ToastContainer />
                <div className='w-[90%] flex flex-col justify-center items-start'>
                    <h1 className='text-black font-bold text-[25px] mt-5 mb-5'>Blogs</h1>
                </div>

                <div className='w-[90%] gap-4 pt-5 mb-10 bg-white flex flex-col justify-center items-center rounded-md shadow-lg'>
                    <TextField required label="Enter Blog Title" type='text' onChange={handleChange} name='title' value={formData.title} className='w-[70%]' />
                    <TextField required label="Enter Blog Topic" type='text' onChange={handleChange} name='topic' value={formData.topic} className='w-[70%]' />
                    <TextField required label="Name of Author" type='text' onChange={handleChange} name='author_name' value={formData.author_name} className='w-[70%]' />
                    <TextField required label="Preview Text" type='text' onChange={handleChange} name='preview_text' value={formData.preview_text} className='w-[70%]' />

                    <ImagePicker placeholderText="Add Author Image ( Optional )" onImageSelect={handleAuthorImageSelect} />

                    {formData.dynamicContent.map((content, index) => (
                        <div className='w-[70%] flex flex-col justify-center items-center gap-2' key={index}>
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

                    <div className='w-[10%]'>
                        <Button onClickProp={handleAddContent} text="+" />
                    </div>

                    <ImagePicker placeholderText="Add Blog Image"
                        onImageSelect={handleBlogImageSelect} />

                    <div className='w-[90%] mb-5 flex flex-col justify-end items-end'>
                        <div className='md:w-[30%] w-full pr-0 md:pr-2'>
                            <Button text="Publish" />
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default BlogPage