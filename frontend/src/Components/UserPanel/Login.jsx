import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import React, { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import login from "/login.webp";
function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleSuccess = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    const { name, email, picture, given_name, family_name, email_verified } =
      decoded;
    if (!email_verified) {
      toast.error("Please verify your email first.");
      return;
    }
    const googledata = {
      name,
      email,
      picture,
      given_name,
      family_name,
      email_verified,
    };

    try {
      const res = await axios.post(
        "http://localhost:3000/user/auth/google-login",
        googledata
      );
      if (res.data) {
        localStorage.setItem("Users", JSON.stringify(res.data.user));
        toast.success("You have logged in successfully.");
        setTimeout(() => {
          navigate("/"); // Redirect to home page
        }, 1800);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An unexpected error occurred"
      );
    }
  };

  const handleError = () => {
    console.log("Login Failed");
  };

  useEffect(() => {
    const data = localStorage.getItem("Users");
    if (data) {
      toast.success("You are already logged in.");
      setTimeout(() => {
        navigate("/"); // Redirect to home page
      }, 1800);
    }
  }, [navigate]);

  const onSubmit = async (data) => {
    const userInfo = {
      email: data.email,
      password: data.password,
    };

    try {
      const res = await axios.post(
        "http://localhost:3000/user/login",
        userInfo
      );
      if (res.data) {
        localStorage.setItem("Users", JSON.stringify(res.data.user));
        toast.success("You have logged in successfully.");
        setTimeout(() => {
          navigate("/"); // Redirect to home page
        }, 1800);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An unexpected error occurred"
      );
    }
  };

  return (
    <>
      <div className="min-h-screen w-screen flex justify-center items-center bg-gray-50">
        <div className="w-[68vw] h-[70vh] rounded-2xl shadow-2xl overflow-hidden bg-white flex flex-row-reverse">
          <div className="w-1/2">
            <img src={login} className="w-full" alt="" />
          </div>
          <div className="w-1/2 border-black border-r-[1px]">
          <h1 className="my-6 text-3xl text-center">Login</h1>
            <div className="w-[300px] h-[280px] mx-auto px-1">
              <form onSubmit={handleSubmit(onSubmit)}>
              
                <label className="block text-lg font-medium text-gray-700">
                  Email </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  {...register("email", { required: "Email is required" })}
                   className="mt-1 w-full px-4 py-2  border-[2px] border-black rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                
                />



                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
                  <label className="block text-lg font-medium text-gray-700">Password</label>
               
                <div  className="mt-1 flex w-full pl-4 pr-2 py-2  border-[2px] border-black rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 justify-between">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter your password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                    className="outline-none "
                  />
                  {showPassword ? (
                    <FaEye
                      className="text-2xl"
                      onClick={() => setShowPassword((prev) => !prev)}
                    />
                  ) : (
                    <FaEyeSlash
                      className="text-2xl"
                      onClick={() => setShowPassword((prev) => !prev)}
                    />
                  )}
                </div>

                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 rounded-3xl my-2  transition duration-200"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
                <div className="flex justify-center mt-2">
                  <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={handleError}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center my-3">
                  <hr className="flex-grow border-t border-gray-300" />
                  <span className="mx-3 text-gray-500">OR</span>
                  <hr className="flex-grow border-t border-gray-300" />
                </div>

                <p className="text-center text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-indigo-600 hover:underline"
                  >
                    Register
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
