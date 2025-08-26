import React from "react";
import pexelimg from "../../images/pexel.webp";
import heroimg from "../../images/heroimg.jpeg";
import { Link } from "react-router-dom";
import Slidermsz from "./Slidermsz";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
function Home() {

  return (
    <>
      <div className="w-full h-[90vh] bg-gradient-to-b from-gray-50 to-white flex flex-col justify-center items-center text-center relative overflow-hidden">
        <div className="absolute top-10 left-10 w-48 h-48 bg-purple-200 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-400 rounded-full opacity-30 blur-2xl"></div>

        <h1 className="font-serif text-lg text-gray-600 uppercase tracking-widest z-10">
          Discover the Ultimate
        </h1>
        <h1 className="text-[3.5rem] font-bold font-serif text-gray-800 mt-4 z-10">
          Library Management System - BookHub
        </h1>
        <p className="text-lg text-gray-600 mt-4 max-w-3xl z-10">
          Empowering your library with advanced tools for seamless management
          and access.
        </p>
        <Link
          to="/books"
          className="mt-8 bg-purple-600 text-white py-3 px-8 rounded-lg shadow-lg text-lg hover:bg-purple-700 transition-all z-10"
        >
          Explore Books
        </Link>
      </div>

      <div className="h-[184vh] bg-gradient-to-b from-gray-50 to-white w-full px-36 relative overflow-hidden">
        <div className="absolute top-20 left-20 w-48 h-48 bg-purple-200 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-purple-400 rounded-full opacity-30 blur-2xl"></div>

        <div className="w-full pt-36 flex gap-6 justify-between">
          <div className="w-[54vw] py-10 px-14 border border-solid border-purple-600 rounded-2xl font-serif bg-white">
            <h1 className="text-4xl mb-6 text-[rebeccapurple]">
              Delve into the evolution of BookHub
            </h1>
            <h2 className="text-xl">
              BookHub is a comprehensive Library Management System offering
              features like a login system, register form, and library card
              download for efficient library operations.
            </h2>
          </div>
          <div
            className="w-[28vw] overflow-hidden bg-cover rounded-2xl"
            style={{ backgroundImage: `url(${pexelimg})` }}
          ></div>
        </div>

        <div className="w-full h-[29rem] mt-8 rounded-2xl flex gap-8 justify-between text-white font-mono">
          <div className="w-[55%] h-full bg-black rounded-2xl py-14 px-12">
            <h1 className="text-5xl mb-12 leading-[2.8rem]">
              Our Unique Value Proposition
            </h1>
            <div className="flex gap-8">
              <div>
                <h1 className="text-[22px] mb-6">Efficient Management</h1>
                <h2 className="text-xl">
                  Simplify library operations with our user-friendly login
                  system and registration form, streamlining administrative
                  tasks.
                </h2>
              </div>
              <div>
                <h1 className="text-[22px] mb-6">Digital Access</h1>
                <h2 className="text-xl">
                  Easily download your library card, enabling seamless access to
                  resources and services on any device, from anywhere.
                </h2>
              </div>
            </div>
          </div>
          <div className="w-[50%] h-full rounded-2xl">
            <img
              src={heroimg}
              alt=""
              srcSet=""
              className="h-[29rem] rounded-2xl"
            />
          </div>
        </div>

        <div className="mt-20 font-mono">
          <h1 className="text-center text-5xl mb-10">Client Testimonials</h1>
          <Slidermsz />
        </div>
      </div>
     
    </>
  );
}

export default Home;
