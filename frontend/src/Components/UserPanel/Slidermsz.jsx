import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import avatar from '../../images/avatar.jpeg'

function Slidermsz() {
  const [userComment, setUsercomment] = useState([]);

  useEffect(() => {
    const getComment = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/comment/getcomments");
        setUsercomment(data);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    };

    getComment();
  }, []);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {userComment.map((info) => (
          <div
            className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg p-6"
            key={info._id} // Assuming each comment has a unique _id
          >
            <div className="flex justify-start items-center mb-4"></div>
            <p className="text-gray-600 mb-0 line-clamp-2">{info.comment}</p>
            <div className="flex items-center mt-4">
              <img
                className="w-[5.5rem] h-[5.5rem] rounded-full mr-4"
                // src={info.imagepath}
                src={avatar}
                alt="Avatar"
              />
              <div className="text-sm">
                <p className="text-gray-900 leading-none">{info.username}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default Slidermsz;
