import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import toast from "react-hot-toast";

function Profile() {
  function capitalizeFirstLetter(string) {
    if (!string) return ''; // Handle empty or null strings
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
 const navigate=useNavigate();
 const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [created, setCreatedat] = useState('');
  const [image, setImage] = useState('');
  const [borrowed, setBorrowed] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const localData = localStorage.getItem("Users");
    if (localData) {
      const userData = JSON.parse(localData);
      axios.post('http://localhost:3000/profile', { username: userData.username })
        .then(response => {
          const user = response.data;
          setUsername(user.username);
          setEmail(user.email);
          setStatus(user.status);
          setImage(user.image);
          setBorrowed(user.borrowedBooks);
          setUserId(user._id);

          const createddate = user.createdAt;
          const trimmedDate = createddate.split("T")[0];
          setCreatedat(trimmedDate);
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    } else {
      toast.error("You are not logged in.You do not have permission to this page.");
      setTimeout(()=>{
        navigate("/");

      },1000);
    }
  }, []);
  const putComment=async ()=>{
    const response=await axios.post('http://localhost:3000/comment/setcomments',{userId:userId,username:username,comment:comments});
    if(response.status){
      toast.success("Comment added successfully");
    }else{
      toast.error("Error adding comment");
    }
  }

  return (
    <>
    <div className="bg-gray-100 font-sans leading-normal tracking-normal">
      <div className="container mx-auto my-5 p-5">
        <div className="md:flex no-wrap md:-mx-2 ">
          <div className="w-full md:w-3/12 md:mx-2">
            <div className="bg-white p-3 border-t-4 border-green-400">
              <div className="image overflow-hidden">
                <img
                  className="h-auto w-full mx-auto"
                  src={image ? image : "/avatar.jpeg"}
                  alt="Profile Picture"
                />
              </div>
              <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">
                {username}
              </h1>
              <ul className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
                <li className="flex items-center py-3">
                  <span>Status</span>
                  <span className="ml-auto">
                    <span className="bg-orange-400 py-1 px-2 rounded text-white text-sm">
                      {capitalizeFirstLetter(status)}
                    </span>
                  </span>
                </li>
                <li className="flex items-center py-3">
                  <span>Member since</span>
                  <span className="ml-auto">{created}</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full md:w-9/12 mx-2 h-64">
            <div className="bg-white p-3 shadow-sm rounded-xl">
              <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                <span className="text-orange-500">
                  <svg
                    className="h-5 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12H7v2h2v-2zM5 12H3v2h2v-2zM7 9H5v2h2V9zM5 6H3v2h2V6zm14 0v12H1V6h18zM2 16h16V8H2v8z" />
                  </svg>
                </span>
                <span className="tracking-wide">About</span>
              </div>
              <div className="text-gray-700">
                <div className="grid md:grid-cols-2 text-sm">
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Full Name</div>
                    <div className="px-4 py-2">{username}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Email</div>
                    <div className="px-4 py-2">{email}</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Phone</div>
                    <div className="px-4 py-2">+123 456 789</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold">Address</div>
                    <div className="px-4 py-2">123 Main St, Springfield</div>
                  </div>
                </div>
              </div>
              
            </div>

            <div className="my-4"></div>
            {borrowed.length > 0 ? (
              <div className="bg-white p-3 shadow-sm rounded-xl">
                <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                  <span className="text-orange-500">
                    <svg
                      className="h-5 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 2a2 2 0 00-2 2v2H7V4a3 3 0 013-3 3 3 0 013 3v2h-1V4a2 2 0 00-2-2zm7 6H3v8a3 3 0 003 3h8a3 3 0 003-3V8zm-7 6H7v-2h3v2zm5 0h-3v-2h3v2zm0-4H7v-2h8v2z" />
                    </svg>
                  </span>
                  <span className="tracking-wide">Books Borrowed</span>
                </div>
                <ul className="list-inside space-y-2">
                  {borrowed.map((book, index) => (
                    <li key={index}>
                      <div className="text-teal-600">{book.title}</div>
                      <div className="text-gray-500 text-xs">
                        Borrowed on: {book.borrowedOn}
                      </div>
                    </li>
                    
                  ))}
                </ul>
              </div>
            ) : (
              <div className="h-8 w-full flex justify-center items-center text-2xl bg-white p-12 text-[#ff0000] rounded-xl">
              <h1>No borrowed books</h1>

              </div>
            )}

            <div className="my-4"></div>

            <div className="bg-white p-3 shadow-sm rounded-xl">
              <div className="flex justify-between space-x-2 font-semibold text-gray-900 leading-8">
                <div className="flex items-center gap-1">
                <span className="text-orange-500">
                  <svg
                    className="h-5 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M8 9h4v1H8V9zm0-2h4V7H8v1zM7 1a1 1 0 00-1 1v16a1 1 0 001 1h10a1 1 0 001-1V2a1 1 0 00-1-1H7zm9 16H8V3h8v14zM2 4h4v2H2V4zm0 4h4v2H2V8zm0 4h4v2H2v-2zm0 4h4v2H2v-2z" />
                  </svg>
                </span>
                <span className="tracking-wide">Comments</span>
                </div>
                <span className="bg-red-600 text-white px-2 py-1 rounded-md cursor-pointer">
                  DeleteComment
                </span>
              </div>
              <div className="text-gray-700">
                <textarea
                  className="w-full p-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                  rows="4"
                  placeholder="Leave a comment..."
                  onChange={(e) => setComments(e.target.value)}
                ></textarea>
                <button className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-green-400" onClick={putComment}>
                  Submit Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Profile;
