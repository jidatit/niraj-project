import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Testimonials from "./cards/Testimonials";

import left from "../../assets/icons/left-arrow.png"
import right from "../../assets/icons/right-arrow.png"

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className=" absolute top-[50%] right-[-15px] sm:right-[-25px] cursor-pointer px-1"
      onClick={onClick}
    ><img src={right} className=" max-w-[24px] md:max-w-[40px] w-full"/></div>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className=" absolute top-[50%] left-[-15px] sm:left-[-25px] cursor-pointer px-1"
      onClick={onClick}
    ><img src={left} className=" max-w-[24px] md:max-w-[40px] w-full"/></div>
  );
}

function TestimonialSlider() {
  const [showPrevButton, setShowPrevButton] = useState(false);
  const [showNextButton, setShowNextButton] = useState(true); // Assuming next button is always shown initially

  useEffect(() => {
    // Hide prev button on initial slide
    setShowPrevButton(false);
  }, []);

  const handleSlideChange = (currentSlide, slidesCount) => {
    setShowPrevButton(currentSlide !== 0);
    setShowNextButton(currentSlide !== slidesCount - 1);
  };

  var settings = {
    // dots: true,
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
    beforeChange: (current, next) => handleSlideChange(next, settings.slidesToShow)
  };

  return (
    <div className="slider-container !max-w-[360px] sm:!max-w-[360px] md:!max-w-[700px] lg:!max-w-[1000px] xl:!max-w-[1140px]">
      <Slider {...settings}>
        <div>
          <Testimonials />
        </div>
        <div>
          <Testimonials />
        </div>
        <div>
          <Testimonials />
        </div>
        <div>
          <Testimonials />
        </div>
        <div>
          <Testimonials />
        </div>
      </Slider>
      {showPrevButton && (
        <button className="slick-prev" aria-label="Previous" type="button">
          Previous
        </button>
      )}
      {showNextButton && (
        <button className="slick-next" aria-label="Next" type="button">
          Next
        </button>
      )}
    </div>
  );
}

export default TestimonialSlider;
