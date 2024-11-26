import { useState, useEffect } from "react";
import bg from "../../assets/homepage/bg1.png";
import handimg from "../../assets/homepage/hand.png";
import personimg from "../../assets/homepage/person.png";
import bannerimg from "../../assets/homepage/banner.png";
import Faq from "../components/cards/Faq";
import ResourceCenter from "../components/cards/ResourceCenter";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../db";
import TestimonialSlider from "../components/Slider";
import BigButton from "../components/dropdown_button/bigButton";
import { FaqsData } from "./data/faqs";

const Homepage = () => {
  const [blogs, setBlogs] = useState([]);

  const faqComponents = FaqsData.map((faq, index) => (
    <Faq key={index} ques={faq.ques} ans={faq.ans} />
  ));

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsCollection = collection(db, "blogs");
        const snapshot = await getDocs(blogsCollection);
        const blogsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogs(blogsData);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div>
      {/* <div className='w-full relative pb-[70px] h-[80vh] md:h-[90vh] lg:h-[100vh] flex flex-col md:flex-row justify-end md:justify-center items-center gap-5'
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className='w-[90%] md:w-[55%] md:p-0 p-[30px] z-[10] md:absolute left-5 md:ml-[60px] gap-5 flex flex-col justify-center items-start md:bg-transparent bg-white/30 md:backdrop-blur-none backdrop-blur-lg md:border-none border border-white/20 md:shadow-none shadow-lg md:rounded-none rounded-lg'>
          <h1 className='font-bold text-[18px] md:text-[25px] text-center md:text-left'>
            Insurance Done with the Convenience of Modern Technology, and the Customer Service of a Real Person
          </h1>
          <p className='text-[15px] md:text-[15px] text-center md:text-left'>
            The Thaker Insurance team at John Galt is offering transparency and control back to our clients. We want you to have information about your policies and quotes at your fingertips, but still have the ability to reach your agent by phone or email.
            On our new website, you will be able to submit requests for quotes and have progress updates until they are delivered. Other features include: submitting requests for documents, binders, checking policy information, and premium history. All of this without having to pick up the phone, but while still having access to a live agent when you need one.
            With the insurance companies in Florida having unexpected increases in premium and non-renewing policies, we have implemented a feature on our site that will automatically send you quotes for your homeowner’s policies, starting in 2025. This should help our clients keep their expenses as low as possible, by being able to know if there is a better rate available or if they currently have the best one. It also will ensure that if your policy is being non-renewed at the end of the term, that there is another option available and avoid a lapse in coverage.
          </p>
          <div className='w-full flex flex-col md:flex-row justify-center md:justify-start items-center gap-5'>

            <BigButton GFQ={true} text="Get Free Quote" />
            <BigButton R={true} text="Register" />

          </div>
        </div>

        <div className='w-full md:w-[40%] z-[9] absolute top-0 right-5 md:mr-[20px]'>
          <img src={handimg} alt="" className='w-full h-auto' />
        </div>
      </div> */}
      <div
        className="w-full relative pb-[70px] h-[80vh] md:h-[90vh] lg:h-[100vh] flex flex-col md:flex-row justify-end md:justify-center items-center gap-5"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="w-[90%] md:w-[60%] z-[10] md:absolute left-5 md:ml-[60px] gap-5 flex flex-col justify-center items-start">
          <h1 className="font-bold text-[27px] md:text-[50px] text-start md:text-left">
            It's Not Just Business, It's Personal.
          </h1>
          <p className="text-[17px] md:text-[24px] text-start md:text-left ">
            Our agency developed this website with you in mind, our goal is to
          </p>
          <ul className="list-disc pl-5 text-[15px] md:text-[20px] ">
            <li>
              Increase the amount of time we spend with you on the phone and
              email
            </li>
            <li>
              Increase the speed that you get your quotes, policies and requests
              back
            </li>
            <li>
              Provide more information and transparency for your insurance costs
            </li>
            <li>
              Automatically provide quotes from every company at renewal, to
              ensure you have the best option for your homeowner's insurance
            </li>
          </ul>
          <div className="w-full flex flex-col md:flex-row justify-center md:justify-start items-center gap-5 mt-4">
            <BigButton GFQ={true} text="Get Free Quote" />
            <BigButton R={true} text="Register" />
          </div>
        </div>

        <div className="w-full md:w-[40%] z-[9] absolute top-0 right-5 md:mr-[20px]">
          <img src={handimg} alt="" className="w-full h-auto" />
        </div>
      </div>

      {/* <div className='w-full min-h-screen p-[20px] mt-[40px] flex flex-col lg:flex-row justify-center items-center gap-5'>
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
      </div> */}
      <div className="w-full min-h-screen p-[20px] mt-[40px] flex flex-col lg:flex-row justify-center items-center gap-10 bg-white  rounded-lg">
        <img
          src={personimg}
          alt="Insurance Agent"
          className="w-full lg:w-1/2 h-auto object-cover rounded-lg shadow-md"
        />
        <div className="w-full lg:w-[50%] flex flex-col justify-start items-start gap-6">
          <h2 className="font-bold text-[30px] xl:text-[40px] ">
            How does it work?
          </h2>
          <p className="text-start text-[18px] xl:text-[22px] text-gray-700 leading-relaxed">
            An insurance agency's job can be divided into two major
            responsibilities: first, to search for the best available policy for
            you, and second, to advise you on how to use the policy in the way
            that best fits you. We believe that the advising role is much more
            important in today's market.
          </p>
          <p className="text-start text-[18px] xl:text-[22px] text-gray-700 leading-relaxed">
            Our new website is a useful tool that we can use to help us expedite
            the job of quoting and binding to focus on speaking with you, our
            customer. Insurance can be complicated, and it is getting more
            difficult to understand with all the changes in Florida. We want to
            make sure that we can be there to help you understand what you are
            buying and what it is going to cover you for.
          </p>
          <BigButton GFQ={true} text="Get Free Quote" className="mt-4" />
        </div>
      </div>

      <div
        className="w-full min-h-[320px] mt-[50px] mb-[50px] flex flex-col justify-center items-center gap-5"
        style={{
          backgroundImage: `url(${bannerimg})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <h3 className="text-center w-[70%] text-white md:text-[40px] font-semibold text-[23px]">
          In search of reliable insurance experts? You're in the right place
          with us.
        </h3>
        <div className="w-[60%] flex md:flex-row flex-col justify-center items-center gap-5">
          <BigButton GFQ={true} text="Get Free Quote" />
          <BigButton R={true} text="Register" />
        </div>
      </div>

      <div className="w-full flex flex-col justify-center items-center gap-5">
        <div className="w-[80%] flex flex-col md:justify-start mt-[40px] mb-[40px] justify-center items-center md:items-start">
          <h2 className="font-bold md:text-[40px] text-[25px] text-[#003049]">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="w-[80%] mb-[40px] grid md:grid-cols-2 justify-center items-center gap-5 grid-cols-1">
          {faqComponents}
        </div>
      </div>

      <div className="w-full flex flex-col justify-center items-center gap-5">
        <div className="w-[80%] flex flex-col md:justify-start mt-[40px] mb-[40px] justify-center items-center md:items-start">
          <h2 className="font-bold md:text-[40px] md:mt-0 mt-[-90px] text-[25px] text-[#003049]">
            Resource Center
          </h2>
        </div>
        <div className="w-[80%] mb-[40px] grid md:grid-cols-2 justify-center items-center gap-5 grid-cols-1">
          {blogs &&
            blogs.map((item, index) => (
              <div key={index}>
                <Link to={`/resource-center/blog/${item.id}`}>
                  <ResourceCenter key={index} item={item} />
                </Link>
              </div>
            ))}
        </div>
      </div>

      <div className="w-full flex relative flex-col justify-center items-center gap-5">
        <div className="w-full md:w-[80%] flex flex-col md:justify-start mt-4 md:mt-[40px] mb-4 md:mb-[40px] justify-center items-center md:items-start">
          <h2 className="font-bold md:text-[40px] text-[25px] text-[#003049]">
            Testimonials
          </h2>
        </div>

        <section
          id="testimonials"
          className="w-full flex flex-col md:flex-row justify-center mb-4 md:mb-[40px] items-center gap-5 overflow-x-hidden"
        >
          <TestimonialSlider />
        </section>
      </div>
    </div>
  );
};

export default Homepage;
