import React, { useEffect, useState } from 'react';
import Faq from '../components/cards/Faq';
import ResourceCenter from '../components/cards/ResourceCenter';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../db';

const Resourcecenterpage = () => {
    const [blogs, setBlogs] = useState([]);
    const [faqs, setFaqs] = useState(new Array(8).fill(null));

    useEffect(() => {
        // Fetch blogs data from Firestore
        const fetchBlogs = async () => {
            try {
                const blogsCollection = collection(db, 'blogs');
                const snapshot = await getDocs(blogsCollection);
                const blogsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setBlogs(blogsData);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        };

        fetchBlogs();
    }, []);

    const faqComponents = faqs.map((_, index) => (
        <Faq key={index} question={`Question ${index + 1}`} answer={`Answer ${index + 1}`} />
    ));

    return (
        <>
            <div className='w-full flex flex-col justify-center items-center gap-5'>
                {/* Your existing code for rendering Resource Center */}
                <div className='w-[80%] flex flex-col md:justify-start mt-[40px] mb-[40px] justify-center items-start md:items-start'>
                    <h2 className='font-bold md:text-[40px] md:text-start text-start text-[25px] text-[#003049]'>Lorem ipsum dolor sit ament:</h2>
                    <h6 className='font-semibold md:text-[40px] md:text-start text-start text-[25px] text-[#003049]'>Donec quam felis, ultricies nec</h6>
                    <p className='md:text-[18px] text-[14px] text-[#003049]'>Topics include: Insurance, Policy News, Requesting Quotes, Home Insurance, Auto Insurance, Liabilities and more</p>
                </div>
                <div className='w-[80%] mt-[40px] mb-[40px] grid md:grid-cols-2 justify-center items-center gap-5 grid-cols-1'>
                    {blogs.map((blog, index) => (
                        <div key={index} className={` mt-0  md:mt-${(index % 2) === 0 ? "[-80px]" : "0"}`}  >
                            <Link to={`/resource-center/blog/${blog.id}`}><ResourceCenter key={index} item={blog} /></Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Your existing code for rendering FAQs */}
            <div className='w-full flex flex-col justify-center items-center gap-5'>
                <div className='w-[80%] flex flex-col md:justify-start mt-[40px] mb-[40px] justify-center items-center md:items-start'>
                    <h2 className='font-bold md:text-[40px] text-[25px] text-[#003049]'>Frequently Asked Questions</h2>
                </div>
                <div className='w-[80%] mb-[40px] grid md:grid-cols-2 justify-center items-center gap-5 grid-cols-1'>
                    {faqComponents}
                </div>
            </div>
        </>
    );
}

export default Resourcecenterpage;
