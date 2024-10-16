import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../db';

const BlogDetailspage = () => {
    const { id } = useParams(); // Get the blog ID from the URL
    const [blogData, setBlogData] = useState(null);

    useEffect(() => {
        const fetchBlogDetails = async () => {
            try {
                const blogRef = doc(db, 'blogs', id);
                const blogSnapshot = await getDoc(blogRef);
                if (blogSnapshot.exists()) {
                    const data = blogSnapshot.data();
                    setBlogData(data);
                } else {
                    console.log('Blog not found');
                }
            } catch (error) {
                console.error('Error fetching blog details:', error);
            }
        };

        fetchBlogDetails();
    }, [id]);

    if (!blogData) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className='w-full flex flex-col mb-[30px] justify-center items-center gap-5'>
                <div className='w-[80%] flex flex-col mt-[20px] mb-[20px] justify-center items-center'>
                    <img className="w-full max-h-[618px]" src={blogData.MainImageUrl} alt="Blog Main Image" />
                </div>
                
                <div className='w-[80%] flex flex-col sm:flex-row gap-5 justify-start sm:items-center items-start'>
                    <img className="rounded-full w-[70px] h-[70px]" src={blogData.authorImageUrl} alt="Author Image" />
                    <div className='flex flex-col justify-center items-start'>
                        <h1 className='md:text-[26px] font-bold'>{blogData.title}</h1>
                        <p className='text-[14px] md:text-[20px]'>{blogData.author_name} - 22 minutes ago</p>
                    </div>
                </div>

                <div className='w-[80%] flex flex-col gap-5 justify-start items-start'>
                    <p>{blogData.preview_text}</p>
                </div>

                <div className='w-[80%] flex flex-col gap-5 justify-start items-start'>
                    {blogData.dynamicContent.map((content, index) => (
                        <div key={index}>
                            <h1 className='md:text-[30px] md:text-start text-[#003049] font-bold'>{content.heading}</h1>
                            <p>{content.paragraph}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default BlogDetailspage