import React from 'react'
import Faq from '../components/cards/Faq'
import c1 from "../../assets/homepage/c1.png"
import c2 from "../../assets/homepage/c2.png"
import c3 from "../../assets/homepage/c3.png"
import c4 from "../../assets/homepage/c4.png"
import ResourceCenter from '../components/cards/ResourceCenter'

const Resourcecenterpage = () => {
  const faqs = new Array(8).fill(null);

  const faqComponents = faqs.map((_, index) => (
    <Faq key={index} question={`Question ${index + 1}`} answer={`Answer ${index + 1}`} />
  ));

  const rc_data = [
    {
      img: c1,
      topic_name: "Topic Name",
      heading: "Curabitur ullamcorper ultricies nisi",
      desc: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu."
    },
    {
      img: c2,
      topic_name: "Topic Name",
      heading: "Curabitur ullamcorper ultricies nisi",
      desc: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu."
    },
    {
      img: c3,
      topic_name: "Topic Name",
      heading: "Curabitur ullamcorper ultricies nisi",
      desc: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu."
    },
    {
      img: c4,
      topic_name: "Topic Name",
      heading: "Curabitur ullamcorper ultricies nisi",
      desc: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu."
    },
    {
      img: c1,
      topic_name: "Topic Name",
      heading: "Curabitur ullamcorper ultricies nisi",
      desc: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu."
    },
    {
      img: c2,
      topic_name: "Topic Name",
      heading: "Curabitur ullamcorper ultricies nisi",
      desc: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu."
    },
    {
      img: c3,
      topic_name: "Topic Name",
      heading: "Curabitur ullamcorper ultricies nisi",
      desc: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu."
    },
    {
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
          <h2 className='font-bold md:text-[40px] text-[25px] text-[#003049]'>Lorem ipsum dolor sit ament:</h2>
          <h6 className='font-semibold md:text-[40px] text-[25px] text-[#003049]'>Donec quam felis, ultricies nec</h6>
          <p className='md:text-[18px] text-[14px] text-[#003049]'>Topics include: Insurance, Policy News, Requesting Quotes, Home Insurance, Auto Insurance, Liabilities and more</p>
        </div>
        <div className='w-[80%] mt-[40px] mb-[40px] grid md:grid-cols-2 justify-center items-center gap-5 grid-cols-1'>
          {rc_data?.map((item, index) => (
            <div key={index} style={{ marginTop: `${index % 2 === 0 ? '-80px' : '0px'}` }} >
              <ResourceCenter key={index} item={item} />
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