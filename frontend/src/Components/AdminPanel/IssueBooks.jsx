import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const IssueBooks = () => {
  const [isbn, setBookId] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [notes, setNotes] = useState("");
  const [isBookAvailable, setIsBookAvailable] = useState(null);
  const [error, setError] = useState("");

  // Check book availability via API
  const handleCheckAvailability = async () => {
    try {
      if (!isbn) {
        toast.error("Please enter a Book ID to check availability.");
        return;
      }
      setError("");

      const response = await axios.get(
        `http://localhost:3000/check-availability/${isbn}`
      );

      setIsBookAvailable(response.data.available);
    } catch (err) {
      toast.error("This book is not available.");
    }
  };

  // Handle issuing the book
  const handleIssueBook = async (e) => {
    e.preventDefault();
  
    if (isBookAvailable === false) {
      alert("Book is not available. Cannot proceed with issuing.");
      return;
    }
    if (!isbn || !bookTitle || !userId || !userName || !issueDate || !returnDate) {
      toast.error("All fields are required." );
      return;
    }
    if (new Date(issueDate) >= new Date(returnDate)) {
      toast.error( "Return date must be after issue date." );
      return;
    }
    
   try{
  const checkuser=await axios.get(
    `http://localhost:3000/user/check-card/${userId}`
  );
  if(checkuser.status==200){
    const userdata = {
      isbn,
      bookTitle,
      userId,
      userName,
      issueDate,
      returnDate,
      notes,
    };
   console.log(userdata)
    try {
      const response = await axios.post("http://localhost:3000/user/borrowbook", userdata);
      toast.success(response.data.message);
  
      // Reset form values
      setBookId("");
      setBookTitle("");
      setUserId("");
      setUserName("");
      setIssueDate("");
      setReturnDate("");
      setNotes("");
      setIsBookAvailable(null);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message); // Use server error message
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  }else{
    console.log("This user does not exist.")
  }
   }catch(error){
      toast.error(`The user with library card ${userId} doesnot exists.`);
   }
    
  };
  

  return (
    <>
    <div className="p-6 bg-gray-100 h-[90vh]">
      <div className="max-w-5xl h-[90%] mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Issue a Book</h2>
        <form onSubmit={handleIssueBook} className="space-y-4">
          {/* Book Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[16px] px-[6px] font-medium text-gray-700">
                Book ID / ISBN
              </label>
              <input
                type="text"
                value={isbn}
                onChange={(e) => setBookId(e.target.value)}
                placeholder="Enter Book ID"
                className="mt-1 block w-full p-[6px] border-gray-500 rounded-md shadow-sm"
                required
              />
              <button
                type="button"
                onClick={handleCheckAvailability}
                className="mt-2 bg-blue-500 text-white px-4 py-1 rounded"
              >
                Check Availability
              </button>
              {isBookAvailable !== null && (
                <p className="mt-2 text-sm">
                  {isBookAvailable ? (
                    <span className="text-green-500">Book is available</span>
                  ) : (
                    <span className="text-red-500">Book is not available</span>
                  )}
                </p>
              )}
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            <div>
              <label className="block text-[16px] px-[6px] font-medium text-gray-700">
                Book Title
              </label>
              <input
                type="text"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                placeholder="Enter Book Title"
                className="mt-1 block w-full p-[6px]  border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
          </div>

          {/* User Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[16px] px-[6px] font-medium text-gray-700">
                User ID / Library Card Number
              </label>
              <input
                type="number"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter User ID"
                className="mt-1 block w-full p-[6px] border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block text-[16px] px-[6px] font-medium text-gray-700">
                User Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter User Name"
                className="mt-1 block w-full p-[6px] border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[16px] px-[6px] font-medium text-gray-700">
                Issue Date
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="mt-1 p-[6px] block w-full border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-[16px] px-[6px] font-medium text-gray-700">
                Return Due Date
              </label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="mt-1 p-[6px] block w-full border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[16px] px-[6px] font-medium text-gray-700">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes"
              className="mt-1 block w-full p-[6px] border-gray-300 rounded-md"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700"
            >
              Issue Book
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default IssueBooks;
