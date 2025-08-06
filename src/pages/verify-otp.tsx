"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function OTPVerification() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [timer, setTimer] = useState(60);
  const router = useRouter();

  // ✅ Handle OTP input changes
  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // only allow single digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // auto move to next input
    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // ⏱ Countdown Timer
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // 🔐 OTP Verification Logic
  const handleVerify = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp === "1234") {
      alert("✅ OTP Verified!");
      router.push("/patients"); // enable this after deployment
    } else {
      alert("❌ Incorrect OTP");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm">
        <button className="mb-4 text-xl">&larr;</button>
        <h1 className="text-2xl font-bold mb-2">OTP Code Verification</h1>
        <p className="text-gray-500 mb-6">
          Code has been sent to +91 111 ******99
        </p>

        {/* 🔢 OTP Inputs */}
        <div className="flex justify-between gap-2 mb-4">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputsRef.current[idx] = el;
              }}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              maxLength={1}
              className="w-12 h-12 text-center border rounded-xl text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        {/* 🔁 Countdown */}
        <p className="text-sm text-gray-500 text-center mb-4">
          Resend code in{" "}
          <span className="text-blue-500 font-medium">{timer}s</span>
        </p>

        <button
          onClick={handleVerify}
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Verify
        </button>
      </div>
    </div>
  );
}
