"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type FormData = {
  identifier: string;
  password: string;
  remember: boolean;
};

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [loginError, setLoginError] = useState("");
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    const { identifier, password } = data;

    const isEmail = identifier.includes("@");
    const field = isEmail ? "email" : "mobile";

    const url = `https://json-backend-8zn4.onrender.com/users?${field}=${identifier}&password=${password}`;

    try {
      const res = await fetch(url);
      const users = await res.json();

      if (users.length > 0) {
        alert("✅ Login Successful!");
        setLoginError("");

        // ⬇️ Redirect to OTP page
        router.push("/verify-otp");
      } else {
        setLoginError("❌ Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setLoginError("❌ Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-gray-500 text-sm">Hi there, welcome to Shedula</h2>
        <h1 className="text-2xl font-bold mt-2 mb-6">Login</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register("identifier", { required: true })}
            placeholder="Mobile / Email"
            className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.identifier && (
            <p className="text-red-500 text-sm">This field is required</p>
          )}

          <input
            type="password"
            {...register("password", { required: true })}
            placeholder="Password"
            className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">Password is required</p>
          )}

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                {...register("remember")}
                className="accent-blue-600"
              />
              Remember Me
            </label>
            <a href="#" className="text-sm text-blue-500 hover:underline">
              Forgot Password?
            </a>
          </div>

          {loginError && (
            <p className="text-red-500 text-sm">{loginError}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <div className="text-center my-4 text-gray-400">or login with</div>

        <button className="w-full border py-2 rounded-xl flex justify-center items-center gap-2 hover:bg-gray-100">
          <Image
            src="https://img.icons8.com/color/24/google-logo.png"
            alt="Google"
            width={24}
            height={24}
          />
          Continue with Google
        </button>

        <p className="text-center mt-4 text-sm text-gray-500">
          Don’t have an account?{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
