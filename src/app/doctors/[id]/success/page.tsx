"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") ?? "N/A";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full text-center space-y-4">
        <Image
          src="/success.png"
          alt="Success"
          width={150}
          height={150}
          className="mx-auto"
        />
        <h2 className="text-lg font-bold">Appointment Booked</h2>
        <p className="text-gray-700">Successfully!</p>
        <p>
          Token No{" "}
          <span className="text-green-600 font-semibold">
            {token}
          </span>
        </p>
        <p className="text-sm text-gray-500">
          You will receive a notification half an hour before as reminder.
          Thank you...
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-teal-500 text-white px-6 py-2 rounded-full"
        >
          OK
        </button>
      </div>
    </div>
  );
}
