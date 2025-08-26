import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import newregister from "/newregister.webp";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

function Register() {
  useEffect(() => {
    const data = localStorage.getItem("Users");
    if (data) {
      toast.success("Logout to register");
      setTimeout(() => {
        window.open("http://localhost:5173", "_self");
      }, 1800);
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (data.password !== data.confirmpassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const userInfo = {
      username: data.username,
      email: data.email,
      password: data.password,
    };

    try {
      const res = await axios.post(
        "http://localhost:3000/user/signup",
        userInfo
      );
      if (res.data) {
        toast.success("Signup successful.");
        localStorage.setItem("Users", JSON.stringify(res.data.user));

        setTimeout(() => {
          window.open("http://localhost:5173/", "_self");
        }, 1000);
      }
    } catch (error) {
      console.error(`Error while registering user: ${error}`);
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return (
    <>
      <div className="min-h-screen w-screen flex justify-center items-center bg-gray-50">
        <div className="w-[74vw] h-[70vh] rounded-2xl shadow-2xl overflow-hidden bg-white flex ">
          <div className="w-[46%]">
            <img src={newregister} className="w-full" alt="" />
          </div>
          <div className="w-[54%] border-black border-l-[1px]">
            <h1 className="my-4 text-3xl text-center">Register</h1>
            <div className="w-full h-[260px]  px-3">
              <form className="px-8 py-4 " onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-lg font-medium text-gray-700">
                      Username :{" "}
                    </label>
                    <input
                      id="username"
                      type="text"
                      placeholder="Enter username."
                      {...register("username", {
                        required: "Username is required",
                      })}
                      className="mt-1 w-full px-4 py-2  border-[2px] border-black rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.username && (
                      <span className="text-red-500 text-sm">
                        {errors.username.message}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-lg font-medium text-gray-700">
                      Email :
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter email."
                      {...register("email", {
                        required: "Email is required",
                      })}
                      className="mt-1 w-full px-4 py-2  border-[2px] border-black rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.email && (
                      <span className="text-red-500 text-sm">
                        {errors.email.message}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-lg font-medium text-gray-700">
                      Password :{" "}
                    </label>
                    <div className="mt-1 w-full px-4 py-2  border-[2px] border-black rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password."
                        {...register("password", {
                          required: "Password is required",
                        })}
                        className="outline-none w-[90%] bg-gray-50"
                      />
                      {showPassword ? (
                        <FaEye
                          onClick={() => setShowPassword((prev) => !prev)}
                        />
                      ) : (
                        <FaEyeSlash
                          onClick={() => setShowPassword((prev) => !prev)}
                        />
                      )}
                    </div>

                    {errors.password && (
                      <span className="text-red-500 text-sm">
                        {errors.password.message}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-lg font-medium text-gray-700">
                      Confirm Password :{" "}
                    </label>
                    <div className="mt-1 w-full px-4 py-2  border-[2px] border-black rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center">
                      <input
                        id="confirmpassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password."
                        {...register("confirmpassword", {
                          required: "Confirm password is required",
                        })}
                        className="outline-none w-[90%] bg-gray-50"
                      />
                      {showConfirmPassword ? (
                        <FaEye
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
                        />
                      ) : (
                        <FaEyeSlash
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
                        />
                      )}
                    </div>

                    {errors.confirmpassword && (
                      <span className="text-red-500 text-sm">
                        {errors.confirmpassword.message}
                      </span>
                    )}
                  </div>
                  <div className="w-[200%] ">
                    <div className=" my-2">
                      Already have an account?
                      <Link
                        to="/login"
                        className="text-md text-purple-600 hover:underline"
                      >
                        Login
                      </Link>
                    </div>

                    <button
                      type="submit"
                      className="w-2/3 ml-24 bg-black text-white py-2 rounded-3xl my-3 transition duration-200"
                    >
                      Register
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
