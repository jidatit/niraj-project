import detailimg from "../../assets/homepage/detail.png"
import userimg from "../../assets/homepage/user.png"
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../db';

const BlogDetailspage = () => {
    const { id } = useParams(); // Get the blog ID from the URL
    const [blogData, setBlogData] = useState(null);

    useEffect(() => {
        const fetchBlogDetails = async () => {
            try {
                const blogRef = doc(db, 'blogs', id); // Reference to the specific blog document
                const blogSnapshot = await getDoc(blogRef);
                if (blogSnapshot.exists()) {
                    const data = blogSnapshot.data();
                    setBlogData(data); // Set the fetched blog data to state
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
            {/* <div className='w-full flex flex-col mb-[30px] justify-center items-center gap-5'>
                <div className='w-[80%] flex flex-col mt-[20px] mb-[20px] justify-center items-center'>
                    <img src={detailimg} alt="" />
                </div>
                <div className='w-[80%] flex md:flex-row gap-5 flex-col justify-start items-center'>
                    <img src={userimg} alt="" />
                    <div className='flex flex-col justify-center items-start'>
                        <h1 className='md:text-[26px] font-bold'>Lorem ipsum dolor sit ament donec quam felis ultricieis necars</h1>
                        <p className='md:text-[20px]'>Muhammad Nehaal - 22 minutes ago</p>
                    </div>
                </div>

                <div className='w-[80%] flex flex-col gap-5 justify-start items-start'>
                    <p>
                        Consectetuer iaculis magnis lacus orci curabitur purus leo sit rutrum elit lacus arcu dictum eleifend elit risus sociis ad curabitur suspendisse tempor hendrerit justo per gravida montes. Nam fusce per suscipit posuere penatibus platea. Pretium tempor vehicula. Nunc pulvinar auctor maecenas blandit est integer orci nullam lorem. Auctor. Cum accumsan ridiculus enim neque lorem nam imperdiet purus massa hac facilisi quisque. Faucibus donec mollis sociis. Lacinia consequat, per nisl auctor sem condimentum felis viverra nibh cras. Sagittis hymenaeos rhoncus massa magna tortor. Torquent lacinia non vel.
                    </p>
                    <h1 className='md:text-[30px] md:text-start text-[#003049] font-bold'>Consectetuer iaculis magnis lacus orci curabitur purus.</h1>
                    <p>
                        Consectetuer iaculis magnis lacus orci curabitur purus leo sit rutrum elit lacus arcu dictum eleifend elit risus sociis ad curabitur suspendisse tempor hendrerit justo per gravida montes. Nam fusce per suscipit posuere penatibus platea. Pretium tempor vehicula. Nunc pulvinar auctor maecenas blandit est integer orci nullam lorem. Auctor. Cum accumsan ridiculus enim neque lorem nam imperdiet purus massa hac facilisi quisque. Faucibus donec mollis sociis. Lacinia consequat, per nisl auctor sem condimentum felis viverra nibh cras. Sagittis hymenaeos rhoncus massa magna tortor. Torquent lacinia non vel.
                    </p>
                    <h1 className='md:text-[30px] md:text-start text-[#003049] font-bold'>Consectetuer iaculis magnis lacus orci curabitur purus.</h1>
                    <p>
                        Consectetuer iaculis magnis lacus orci curabitur purus leo sit rutrum elit lacus arcu dictum eleifend elit risus sociis ad curabitur suspendisse tempor hendrerit justo per gravida montes. Nam fusce per suscipit posuere penatibus platea. Pretium tempor vehicula. Nunc pulvinar auctor maecenas blandit est integer orci nullam lorem. Auctor. Cum accumsan ridiculus enim neque lorem nam imperdiet purus massa hac facilisi quisque. Faucibus donec mollis sociis. Lacinia consequat, per nisl auctor sem condimentum felis viverra nibh cras. Sagittis hymenaeos rhoncus massa magna tortor. Torquent lacinia non vel.
                    </p>
                    <h1 className='md:text-[30px] md:text-start text-[#003049] font-bold'>Consectetuer iaculis magnis lacus orci curabitur purus.</h1>
                    <p>
                        Consectetuer iaculis magnis lacus orci curabitur purus leo sit rutrum elit lacus arcu dictum eleifend elit risus sociis ad curabitur suspendisse tempor hendrerit justo per gravida montes. Nam fusce per suscipit posuere penatibus platea. Pretium tempor vehicula. Nunc pulvinar auctor maecenas blandit est integer orci nullam lorem. Auctor. Cum accumsan ridiculus enim neque lorem nam imperdiet purus massa hac facilisi quisque. Faucibus donec mollis sociis. Lacinia consequat, per nisl auctor sem condimentum felis viverra nibh cras. Sagittis hymenaeos rhoncus massa magna tortor. Torquent lacinia non vel.
                    </p>
                    <p>
                        Consectetuer iaculis magnis lacus orci curabitur purus leo sit rutrum elit lacus arcu dictum eleifend elit risus sociis ad curabitur suspendisse tempor hendrerit justo per gravida montes. Nam fusce per suscipit posuere penatibus platea. Pretium tempor vehicula. Nunc pulvinar auctor maecenas blandit est integer orci nullam lorem. Auctor. Cum accumsan ridiculus enim neque lorem nam imperdiet purus massa hac facilisi quisque. Faucibus donec mollis sociis. Lacinia consequat, per nisl auctor sem condimentum felis viverra nibh cras. Sagittis hymenaeos rhoncus massa magna tortor. Torquent lacinia non vel.
                    </p>
                    <p>
                        Consectetuer iaculis magnis lacus orci curabitur purus leo sit rutrum elit lacus arcu dictum eleifend elit risus sociis ad curabitur suspendisse tempor hendrerit justo per gravida montes. Nam fusce per suscipit posuere penatibus platea. Pretium tempor vehicula. Nunc pulvinar auctor maecenas blandit est integer orci nullam lorem. Auctor. Cum accumsan ridiculus enim neque lorem nam imperdiet purus massa hac facilisi quisque. Faucibus donec mollis sociis. Lacinia consequat, per nisl auctor sem condimentum felis viverra nibh cras. Sagittis hymenaeos rhoncus massa magna tortor. Torquent lacinia non vel.
                    </p>
                </div>

            </div> */}
              <div className='w-full flex flex-col mb-[30px] justify-center items-center gap-5'>
                <div className='w-[80%] flex flex-col mt-[20px] mb-[20px] justify-center items-center'>
                    <img className="w-full" src={blogData.MainImageUrl} alt="Blog Main Image" />
                </div>
                <div className='w-[80%] flex md:flex-row gap-5 flex-col justify-start items-center'>
                    <img className="rounded-full w-[70px] h-[70px]" src={blogData.authorImageUrl} alt="Author Image" />
                    <div className='flex flex-col justify-center items-start'>
                        <h1 className='md:text-[26px] font-bold'>{blogData.title}</h1>
                        <p className='md:text-[20px]'>{blogData.author_name} - 22 minutes ago</p>
                    </div>
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