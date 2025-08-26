import React, { useEffect } from "react";

function Footer() {
  useEffect(() => {
    document.getElementById("year").textContent = new Date().getFullYear();
  });
  return (
    <>
    <hr />
      <div className="w-full h-[54vh] bg-gray-100 pt-16">
      {/* <div className="w-full h-[54vh] bg-gradient-to-b from-gray-50 to-white pt-16"> */}
        <div className="w-full h-[36vh]">
          <div className="w-24 bg-purple-500 mx-auto mb-4 text-center rounded-3xl h-[3px]"></div>
          <h1 className="text-5xl text-center mb-6">
            Transform Your Library Today
          </h1>
          <p className="text-xl text-center mb-3">
            Experience the power of BookHub’s Library Management System.
          </p>
          <p className="text-xl text-center">
            Take your library services to new heights
          </p>
          <div className="flex justify-center ">
            <button className="border-2 border-solid border-black rounded-[6px] bg-purple-500 py-2 px-4 text-white mt-5 ">GET STARTED</button>
          </div>
        </div>
        <div className="w-full h-[2px] bg-[#8000801a]"></div>
        <div className="w-full flex justify-center">
            <p className="flex mt-3 text-xl">Copyright &copy; <span id="year"></span>BookHub - <span className="text-pink-500"> SujalSubedi</span></p>
        </div>
      </div>
    </>
  );
}

export default Footer;
