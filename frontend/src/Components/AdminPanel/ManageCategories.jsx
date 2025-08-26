import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3000/genre");
        setCategories(response.data); 
      } catch (error) {
        console.error(`Unable to fetch categories: ${error.message}`);
      }
    };
    fetchCategories();
  }, []);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const handleAddCategory = async (data) => {
    try {
      console.log("Category name:", data.name); 
      if (!data.name || data.name.trim() === "") {
        alert("Genre name is required.");
        return;
      }
  
      const newCategory = { name: data.name };
const response = await axios.post("http://localhost:3000/addgenre", newCategory);

      if(response){
          toast.success("Genre added successfully.");
          setCategories(prevCategories => [...prevCategories, response.data]);
            reset();

      }
    } catch (error) {
      console.error(`Unable to add category: ${error.message}`);
    }
  };
  

  const handleEditCategory = async (id) => {
    const newName = prompt("Edit Category Name:");
    if (!newName) return;
  
    try {
      const response = await axios.put(`http://localhost:3000/genre/${id}`, { name: newName });
      toast.success("Category updated successfully.");
      setCategories(
        categories.map((category) =>
          category._id === id ? { ...category, name: newName } : category
        )
      );
    } catch (error) {
      console.error(`Unable to edit category: ${error.message}`);
    }
  };
  

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response=await axios.delete(`http://localhost:3000/genre/${id}`);
        toast.success(response.data.message);
        setCategories(categories.filter((category) => category._id !== id));
      } catch (error) {
        console.error(`Unable to delete category: ${error.message}`);
      }
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-6 pt-2 bg-gray-50">
      <h1 className="text-2xl font-bold mb-5 text-gray-800">Manage Categories</h1>

      {/* Add New Category */}
      <div className="bg-white shadow rounded-lg p-4 mb-5">
        <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
        <form onSubmit={handleSubmit(handleAddCategory)} className="flex gap-4">
          <input
            type="text"
            {...register("name", { required: "Category name is required" })}
            placeholder="Genre Name"
            className="flex-1 border px-3 py-2 rounded-md focus:ring focus:ring-blue-300"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-md shadow hover:bg-blue-600"
          >
            Add
          </button>
        </form>
        {errors.name && <p className="text-red-500 mt-2">{errors.name.message}</p>}
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border px-3 py-2 rounded-md focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Categories List */}
      <div className="overflow-y-auto max-h-[393px] bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Categories</h2>
        {filteredCategories.length > 0 ? (
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Category Name</th>
                <th className="border px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => (
                <tr key={category._id}>
                  <td className="border px-4 py-2">{category.name}</td>
                  <td className="border px-4 py-2 flex gap-2">
                    {/* Edit Button */}
                    <button
                      onClick={() => handleEditCategory(category._id)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteCategory(category._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No categories found.</p>
        )}
      </div>
    </div>
  );
};

export default ManageCategories;
