import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const EditBook = () => {
  const { id } = useParams(); // Get book ID from URL params
  const navigate = useNavigate();
  const [genre, setGenre] = useState([]); // State for genres
  const [bookData, setBookData] = useState(null); // State for fetched book data

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Fetch genres and book data on component mount
  useEffect(() => {
    const getGenre = async () => {
      try {
        const response = await axios.get("http://localhost:3000/genre");
        setGenre(response.data);
      } catch (error) {
        console.error(`Error fetching genres: ${error.message}`);
      }
    };

    const fetchBookData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/editbook/${id}`
        );
        if (response.status === 200) {
          const book = response.data;
          setBookData(book);

          // Prefill form fields
          setValue("_id", book._id);
          setValue("title", book.title);
          setValue("author", book.author);
          setValue("description", book.description);
          setValue("isbn", book.isbn);
          setValue("image", book.image);
          //   setValue("publishedDate", book.publishedDate);
          setValue("genre", book.genre);
          setValue("availableCopies", book.availableCopies);
          setValue("totalCopies", book.totalCopies);
        } else {
          toast.error("Failed to fetch book data.");
        }
      } catch (error) {
        console.error(`Error fetching book: ${error.message}`);
        toast.error("Failed to fetch book data. Please try again later.");
      }
    };

    getGenre();
    fetchBookData();
  }, [id, setValue]);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/editbook/${id}`,
        data
      );
      if (response.status === 200) {
        toast.success("Book updated successfully!");
        navigate("/dashboard/managebook"); // Redirect to book management page
      } else {
        toast.error("Failed to update book.");
      }
    } catch (error) {
      console.error(`Error updating book: ${error.message}`);
      toast.error("An error occurred while updating the book.");
    }
  };

  // Render loading state if book data is not fetched yet
  if (!bookData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="px-6 pt-2 pb-1  max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between mt-1">
        <h2 className="text-2xl font-bold mb-2">Edit Book</h2>
         <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded-md"
              onClick={() => navigate("/dashboard/managebook")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Update Book
            </button>
          </div>
          </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="Title"
              className="w-full px-2 py-1.5 border rounded-md"
              {...register("title", { required: "Book title is required" })}
            />
            {errors.title && (
              <span className="text-red-500 text-sm">
                {errors.title.message}
              </span>
            )}
          </div>

          {/* Author */}
          <div>
            <label
              htmlFor="author"
              className="block text-sm font-medium text-gray-700"
            >
              Author
            </label>
            <input
              type="text"
              id="author"
              placeholder="Author"
              className="w-full px-2 py-1.5 border rounded-md"
              {...register("author", { required: "Author name is required" })}
            />
            {errors.author && (
              <span className="text-red-500 text-sm">
                {errors.author.message}
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              placeholder="Description"
              className="w-full px-2 py-[6px] border rounded-md h-11"
              {...register("description", {
                required: "Description is required",
              })}
            />
            {errors.description && (
              <span className="text-red-500 text-sm">
                {errors.description.message}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Image
            </label>
            <input
              type="file"
              id="image"
              placeholder="Image"
              className="w-full px-2 py-[6px] border rounded-md bg-white "
              {...register("image", { required: "Image is required" })}
            />
            {errors.image && (
              <span className="text-red-500 text-sm">
                {errors.image.message}
              </span>
            )}
          </div>
          <div>
            <label
              htmlFor="isbn"
              className="block text-sm font-medium text-gray-700"
            >
              ISBN
            </label>
            <input
              type="text"
              id="isbn"
              placeholder="ISBN"
              className="w-full px-2 py-[6px] border rounded-md"
              {...register("isbn", { required: "ISBN is required" })}
            />
            {errors.isbn && (
              <span className="text-red-500 text-sm">
                {errors.isbn.message}
              </span>
            )}
          </div>

          {/* Published Date */}
          <div>
            <label
              htmlFor="publishedDate"
              className="block text-sm font-medium text-gray-700"
            >
              Published Date
            </label>
            <input
              type="date"
              id="publishedDate"
              className="w-full px-2 py-[6px] border rounded-md"
              {...register("publishedDate", {
                required: "Published date is required",
              })}
            />
            {errors.publishedDate && (
              <span className="text-red-500 text-sm">
                {errors.publishedDate.message}
              </span>
            )}
          </div>

          {/* Genre */}
          <div>
            <label
              htmlFor="genre"
              className="block text-sm font-medium text-gray-700"
            >
              Genre
            </label>
            <select
              id="genre"
              className="w-full px-2 py-[6px] border rounded-md"
              {...register("genre", { required: "Genre is required" })}
            >
              <option value="">Select Genre</option>
              {genre.map((g) => (
                <option key={g._id} value={g._id}>
                  {g.name}
                </option>
              ))}
            </select>
            {errors.genre && (
              <span className="text-red-500 text-sm">
                {errors.genre.message}
              </span>
            )}
          </div>

          {/* Available Copies */}
          <div>
            <label
              htmlFor="availableCopies"
              className="block text-sm font-medium text-gray-700"
            >
              Available Copies
            </label>
            <input
              type="number"
              id="availableCopies"
              placeholder="Available Copies"
              className="w-full px-2 py-[6px] border rounded-md"
              {...register("availableCopies", {
                required: "Available copies are required",
              })}
            />
            {errors.availableCopies && (
              <span className="text-red-500 text-sm">
                {errors.availableCopies.message}
              </span>
            )}
          </div>

          {/* Total Copies */}
          <div>
            <label
              htmlFor="totalCopies"
              className="block text-sm font-medium text-gray-700"
            >
              Total Copies
            </label>
            <input
              type="number"
              id="totalCopies"
              placeholder="Total Copies"
              className="w-full px-2 py-[6px] border rounded-md"
              {...register("totalCopies", {
                required: "Total copies are required",
              })}
            />
            {errors.totalCopies && (
              <span className="text-red-500 text-sm">
                {errors.totalCopies.message}
              </span>
            )}
          </div>

          {/* Buttons */}
          {/* <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded-md"
              onClick={() => navigate("/dashboard/managebook")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Update Book
            </button>
          </div> */}
        </form>
      </div>
    </>
  );
};

export default EditBook;
