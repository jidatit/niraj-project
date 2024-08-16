import { useState, useEffect } from 'react';
import bg from "../../assets/homepage/bg1.png"
import handimg from "../../assets/homepage/hand.png"
import personimg from "../../assets/homepage/person.png"
import bannerimg from "../../assets/homepage/banner.png"
import Faq from '../components/cards/Faq'
import ResourceCenter from '../components/cards/ResourceCenter'
import { Link } from 'react-router-dom'
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../db';
import TestimonialSlider from '../components/Slider'
import BigButton from '../components/dropdown_button/bigButton';
import { FaqsData } from './data/faqs';

const Homepage = () => {
  const [blogs, setBlogs] = useState([]);

  const faqComponents = FaqsData.map((faq, index) => (
    <Faq key={index} ques={faq.ques} ans={faq.ans} />
  ));

  useEffect(() => {
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

  return (
    <div >

      <div className='w-full relative pb-[70px] h-[80vh] md:h-[90vh] lg:h-[100vh] flex flex-col md:flex-row justify-end md:justify-center items-center gap-5'
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className='w-[90%] md:w-[60%] md:p-0 p-2 z-[10] md:absolute left-5 md:ml-[60px] gap-5 flex flex-col justify-center items-start md:bg-transparent bg-white/30 md:backdrop-blur-none backdrop-blur-lg md:border-none border border-white/20 md:shadow-none shadow-lg md:rounded-none rounded-lg'>
          <h1 className='font-bold text-[27px] md:text-[50px] text-center md:text-left'>
            Trustworthy insurance experts standing by for you
          </h1>
          <p className='text-[17px] md:text-[28px] text-center md:text-left'>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.
          </p>
          <div className='w-full flex flex-col md:flex-row justify-center md:justify-start items-center gap-5'>

            <BigButton GFQ={true} text="Get Free Quote" />
            <BigButton R={true} text="Register" />

          </div>
        </div>

        <div className='w-full md:w-[40%] z-[9] absolute top-0 right-5 md:mr-[20px]'>
          <img src={handimg} alt="" className='w-full h-auto' />
        </div>
      </div>

      <div className='w-full min-h-screen p-[20px] mt-[40px] flex flex-col lg:flex-row justify-center items-center gap-5'>
        <img src={personimg} alt="" />
        <div className='w-full lg:w-[50%] flex flex-col justify-start items-start gap-10'>
          <h2 className='font-bold text-[25px] xl:text-[40px] text-black'>
            Our mission
          </h2>
          <p className='text-start text-[20px] xl:text-[28px]'>
            Our mission is to empower homeowners by providing them with the tools
            and knowledge to take control of their insurance costs. We believe that clear,
            effective communication is the key to achieving this goal. That's why we
            created this platform with your needs in mind, ensuring that you can easily
            connect with us and get the support you need, when you need it.
          </p>
          <BigButton GFQ={true} text="Get Free Quote" />
        </div>
      </div>

      <div className='w-full min-h-[320px] mt-[50px] mb-[50px] flex flex-col justify-center items-center gap-5'
        style={{
          backgroundImage: `url(${bannerimg})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <h3 className='text-center w-[70%] text-white md:text-[40px] font-semibold text-[23px]'>In search of reliable insurance experts? You're in the right place with us.</h3>
        <div className='w-[60%] flex md:flex-row flex-col justify-center items-center gap-5'>
          <BigButton GFQ={true} text="Get Free Quote" />
          <BigButton R={true} text="Register" />
        </div>
      </div>

      <div className='w-full flex flex-col justify-center items-center gap-5'>
        <div className='w-[80%] flex flex-col md:justify-start mt-[40px] mb-[40px] justify-center items-center md:items-start'>
          <h2 className='font-bold md:text-[40px] text-[25px] text-[#003049]'>Frequently Asked Questions</h2>
        </div>
        <div className='w-[80%] mb-[40px] grid md:grid-cols-2 justify-center items-center gap-5 grid-cols-1'>
          {faqComponents}
        </div>
      </div>

      <div className='w-full flex flex-col justify-center items-center gap-5'>
        <div className='w-[80%] flex flex-col md:justify-start mt-[40px] mb-[40px] justify-center items-center md:items-start'>
          <h2 className='font-bold md:text-[40px] md:mt-0 mt-[-90px] text-[25px] text-[#003049]'>Resource Center</h2>
        </div>
        <div className='w-[80%] mb-[40px] grid md:grid-cols-2 justify-center items-center gap-5 grid-cols-1'>
          {blogs && blogs.map((item, index) => (
            <div key={index}>
              <Link to={`/resource-center/blog/${item.id}`}><ResourceCenter key={index} item={item} /></Link>
            </div>
          ))}
        </div>
      </div>

      <div className='w-full flex relative flex-col justify-center items-center gap-5'>
        <div className='w-full md:w-[80%] flex flex-col md:justify-start mt-4 md:mt-[40px] mb-4 md:mb-[40px] justify-center items-center md:items-start'>
          <h2 className='font-bold md:text-[40px] text-[25px] text-[#003049]'>Testimonials</h2>
        </div>

        <section id='testimonials' className='w-full flex flex-col md:flex-row justify-center mb-4 md:mb-[40px] items-center gap-5 overflow-x-hidden'>
          <TestimonialSlider />
        </section>

      </div>

    </div>
  )
}

export default Homepage