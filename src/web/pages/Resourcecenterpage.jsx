import React from 'react'
import Faq from '../components/cards/Faq'
import c1 from "../../assets/homepage/c1.png"
import c2 from "../../assets/homepage/c2.png"
import c3 from "../../assets/homepage/c3.png"
import c4 from "../../assets/homepage/c4.png"
import ResourceCenter from '../components/cards/ResourceCenter'
import { Link } from 'react-router-dom'

const Resourcecenterpage = () => {
  const faqs = new Array(8).fill(null);

  const faqComponents = faqs.map((_, index) => (
    <Faq key={index} question={`Question ${index + 1}`} answer={`Answer ${index + 1}`} />
  ));

  const rc_data = [
    {
      id: 1,
      img: c1,
      topic_name: "Topic Name",
      heading: "Curabitur ullamcorper ultricies nisi",
      desc: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu."
    },
    {
      id: 2,
      img: c2,
      topic_name: "Topic Name",
      heading: "Curabitur ullamcorper ultricies nisi",
      desc: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu."
    },
    {
      id: 3,
      img: c3,
      topic_name: "Topic Name",
      heading: "Curabitur ullamcorper ultricies nisi",
      desc: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu."
    },
    {
      id: 4,
      img: c4,
      topic_name: "Topic Name",
      heading: "Curabitur ullamcorper ultricies nisi",
      desc: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu."
    },
    {
      id: 5,
      img: c1,
      topic_name: "Topic Name",
      heading: "Curabitur ullamcorper ultricies nisi",
      desc: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu."
    },
    {
      id: 6,
      img: c2,
      topic_name: "Topic Name",
      heading: "Curabitur ullamcorper ultricies nisi",
      desc: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu."
    },
    {
      id: 7,
      img: c3,
      topic_name: "Topic Name",
      heading: "Curabitur ullamcorper ultricies nisi",
      desc: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu."
    },
    {
      id: 8,
      img: c4,
      topic_name: "Topic Name",
      heading: "Curabitur ullamcorper ultricies nisi",
      desc: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu."
    },
  ]

  return (
    <>

      <div className='w-full flex flex-col justify-center items-center gap-5'>
        <div className='w-[80%] flex flex-col md:justify-start mt-[40px] mb-[40px] justify-center items-center md:items-start'>
          <h2 className='font-bold md:text-[40px] md:text-start text-center text-[25px] text-[#003049]'>Lorem ipsum dolor sit ament:</h2>
          <h6 className='font-semibold md:text-[40px] md:text-start text-center text-[25px] text-[#003049]'>Donec quam felis, ultricies nec</h6>
          <p className='md:text-[18px] text-[14px] text-[#003049]'>Topics include: Insurance, Policy News, Requesting Quotes, Home Insurance, Auto Insurance, Liabilities and more</p>
        </div>
        <div className='w-[80%] mt-[40px] mb-[40px] grid md:grid-cols-2 justify-center items-center gap-5 grid-cols-1'>
          {rc_data?.map((item, index) => (
            <div key={index} className={` mt-0  md:mt-${(index % 2) === 0 ? "[-80px]" : "0"}`}  >
              <Link to={`/resource-center/blog/${item.id}`}><ResourceCenter key={index} item={item} /></Link>
            </div>
          ))}
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
    </>
  )
}

export default Resourcecenterpage