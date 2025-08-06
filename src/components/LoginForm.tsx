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
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    setLoginError("");
    setLoading(true);
    const { identifier, password } = data;

    try {
      if (role === "patient") {
        const isEmail = identifier.includes("@");
        const field = isEmail ? "email" : "mobile";
        const url = `https://json-backend-8zn4.onrender.com/users?${field}=${encodeURIComponent(
          identifier
        )}&password=${encodeURIComponent(password)}`;

        const res = await fetch(url);
        const users = await res.json();

        if (users.length > 0) {
          alert("✅ Patient login successful");
          // TODO: persist session (e.g., localStorage / context)
          router.push("/verify-otp");
        } else {
          setLoginError("❌ Invalid patient credentials");
        }
      } else {
        // Doctor login using email/mobile + password
        const isEmail = identifier.includes("@");
        const field = isEmail ? "email" : "mobile";
        const url = `https://json-backend-8zn4.onrender.com/doctors?${field}=${encodeURIComponent(
          identifier
        )}&password=${encodeURIComponent(password)}`;

        const res = await fetch(url);
        const doctors = await res.json();

        if (doctors.length > 0) {
          const matched = doctors[0];
          alert(`✅ Doctor login successful (${matched.name})`);
          // TODO: persist doctor session
          router.push(`/doctors/${matched.id}`);
        } else {
          setLoginError("❌ Invalid doctor credentials");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setLoginError("❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-gray-500 text-sm">Welcome to Shedula</h2>
            <h1 className="text-3xl font-bold mt-1">Login</h1>
          </div>
          <div className="flex gap-2 bg-gray-100 rounded-full p-1">
            <button
              type="button"
              onClick={() => setRole("patient")}
              className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                role === "patient"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-blue-50"
              }`}
            >
              Patient
            </button>
            <button
              type="button"
              onClick={() => setRole("doctor")}
              className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                role === "doctor"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-blue-50"
              }`}
            >
              Doctor
            </button>
          </div>
        </div>

        <p className="text-sm mb-6">
          {role === "patient"
            ? "Login with mobile or email and password"
            : "Login as doctor with email or mobile and password"}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register("identifier", { required: "Required" })}
              placeholder={role === "patient" ? "Mobile / Email" : "Doctor Mobile / Email"}
              className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.identifier && (
              <p className="text-red-500 text-sm mt-1">{errors.identifier.message}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              {...register("password", { required: "Required" })}
              placeholder="Password"
              className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("remember")} className="accent-blue-600" />
              Remember Me
            </label>
            <button type="button" className="text-blue-500 hover:underline">
              Forgot Password?
            </button>
          </div>

          {loginError && (
            <div className="bg-red-100 text-red-700 px-3 py-2 rounded">{loginError}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading ? "Logging in..." : `Login as ${role === "patient" ? "Patient" : "Doctor"}`}
          </button>
        </form>

        <div className="text-center my-4 text-gray-400">or continue with</div>

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
