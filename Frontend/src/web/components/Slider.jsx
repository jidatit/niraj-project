import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Testimonials from "./cards/Testimonials";
import { testimonialsData } from "../pages/data/testimonials";

import left from "../../assets/icons/left-arrow.png"
import right from "../../assets/icons/right-arrow.png"

function SampleNextArrow(props) {
  const { onClick } = props;
  return (
    <div
      className=" absolute top-[50%] right-[0px] sm:right-[-25px] cursor-pointer px-1 z-[20]"
      onClick={onClick}
    ><img src={right} className=" max-w-[24px] md:max-w-[40px] w-full" /></div>
  );
}

function SamplePrevArrow(props) {
  const { onClick } = props;
  return (
    <div
      className=" absolute top-[50%] left-[0px] sm:left-[-25px] cursor-pointer px-1 z-[20]"
      onClick={onClick}
    ><img src={left} className=" max-w-[24px] md:max-w-[40px] w-full" /></div>
  );
}

function TestimonialSlider() {

  var settings = {
    infinite: true,
    autoplay: false,
    speed: 2000,
    slidesToShow: 2,
    slidesToScroll: 1,
    initialSlide: 0,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 0
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 0
        }
      }
    ],
  };

  return (
    <div className="slider-container !max-w-[360px] sm:!max-w-[360px] md:!max-w-[700px] lg:!max-w-[1000px] xl:!max-w-[1140px]">
      <Slider {...settings}>
        {testimonialsData && testimonialsData.map((testimonial, index) => (
          <div key={index}>
            <Testimonials text={testimonial.text} person={testimonial.person} />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default TestimonialSlider;
