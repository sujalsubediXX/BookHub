import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddNewBook = () => {
  const [genre, setGenre] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const getGenre = async () => {
      try {
        const response = await axios.get("http://localhost:3000/genre");
        setGenre(response.data);
      } catch (error) {
        console.error(`Error fetching genres: ${error.message}`);
        toast.error("Failed to load genres. Please try again.");
      }
    };
    getGenre();
  }, []);

  const onSubmit = async (data) => {
    if (data.availableCopies > data.totalCopies) {
      toast.error(
        "The available copies of the book must be less than or equal to the total copies."
      );
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("author", data.author);
    formData.append("description", data.description);
    formData.append("isbn", data.isbn);
    formData.append("publishedDate", data.publishedDate);
    formData.append("genre", data.genre);
    formData.append("availableCopies", data.availableCopies);
    formData.append("totalCopies", data.totalCopies);
    formData.append("imageFile", data.imageFile[0]);

    try {
      const response = await axios.post(
        "http://localhost:3000/addbook",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        toast.success(response.data.message);
        reset();
        navigate("/dashboard/managebook");
      } else {
        toast.error(response.data.message || "Failed to add the book.");
      }
    } catch (error) {
      console.error(`Error adding book: ${error.message}`);
      toast.error("Failed to add the book. Please try again.");
    }
  };

  return (
    <div className="px-6 py-3 max-h-[90vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-3">Add New Book</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 border rounded-md"
          {...register("title", { required: "Book title is required" })}
        />
        {errors.title && (
          <span className="text-red-500 text-sm">{errors.title.message}</span>
        )}

        <input
          type="text"
          placeholder="Author"
          className="w-full p-2 border rounded-md"
          {...register("author", { required: "Author name is required" })}
        />
        {errors.author && (
          <span className="text-red-500 text-sm">{errors.author.message}</span>
        )}

        <textarea
          placeholder="Description"
          className="w-full p-2 border rounded-md"
          {...register("description", { required: "Description is required" })}
        />
        {errors.description && (
          <span className="text-red-500 text-sm">
            {errors.description.message}
          </span>
        )}

        <input
          type="file"
          className="w-full p-2 border bg-white rounded-md"
          {...register("imageFile", { required: "Image file is required" })}
        />
        {errors.imageFile && (
          <span className="text-red-500 text-sm">
            {errors.imageFile.message}
          </span>
        )}

        <input
          type="text"
          placeholder="ISBN"
          className="w-full p-2 border rounded-md"
          {...register("isbn", { required: "ISBN is required" })}
        />
        {errors.isbn && (
          <span className="text-red-500 text-sm">{errors.isbn.message}</span>
        )}

        <input
          type="date"
          className="w-full p-2 border rounded-md"
          {...register("publishedDate", {
            required: "Published date is required",
          })}
        />
        {errors.publishedDate && (
          <span className="text-red-500 text-sm">
            {errors.publishedDate.message}
          </span>
        )}

        <select
          className="w-full p-2 border rounded-md"
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
          <span className="text-red-500 text-sm">{errors.genre.message}</span>
        )}

        <input
          type="number"
          placeholder="Available Copies"
          className="w-full p-2 border rounded-md"
          {...register("availableCopies", {
            required: "Available copies are required",
            min: { value: 0, message: "Cannot be negative" },
          })}
        />
        {errors.availableCopies && (
          <span className="text-red-500 text-sm">
            {errors.availableCopies.message}
          </span>
        )}

        <input
          type="number"
          placeholder="Total Copies"
          className="w-full p-2 border rounded-md"
          {...register("totalCopies", {
            required: "Total copies are required",
            min: { value: 1, message: "Must be at least 1" },
          })}
        />
        {errors.totalCopies && (
          <span className="text-red-500 text-sm">
            {errors.totalCopies.message}
          </span>
        )}

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
            Add Book
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewBook;
