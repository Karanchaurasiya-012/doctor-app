"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

type Doctor = {
  id: number;
  name: string;
  specialty: string;
  image: string;
};

export default function BookAppointmentPage() {
  const params = useParams();

  if (!params || !params.id) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [imageError, setImageError] = useState(false); // fallback ke liye

  useEffect(() => {
    async function fetchDoctor() {
      try {
        const res = await fetch(`https://json-backend-8zn4.onrender.com/doctors/${id}`);
        if (!res.ok) throw new Error("Failed to fetch doctor");
        const data = await res.json();
        setDoctor(data);
      } catch (err) {
        console.error("Error loading doctor", err);
      }
    }

    if (id) fetchDoctor();
  }, [id]);

  if (!doctor) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-[#f4f6fc] px-5 py-6 max-w-md mx-auto">
      {/* Top Section */}
      <div className="flex flex-col items-center text-center bg-white rounded-2xl p-4 shadow-md">
        <div className="w-28 h-28 relative rounded-full overflow-hidden border-4 border-white shadow-md">
          <Image
            src={imageError ? "/doctor.png" : doctor.image}
            alt={doctor.name}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        </div>
        <h1 className="mt-4 text-xl font-semibold">{doctor.name}</h1>
        <p className="text-blue-600 text-sm">{doctor.specialty}</p>
        <p className="text-gray-500 text-sm">The Wiscon Hospital in California, US</p>
      </div>

      {/* Stats */}
      <div className="flex justify-around mt-6 text-center text-sm text-gray-600 bg-white rounded-2xl p-4 shadow-md">
        <div>
          <p className="text-lg font-bold">5,000+</p>
          <p>Patients</p>
        </div>
        <div>
          <p className="text-lg font-bold">10+</p>
          <p>Years exper..</p>
        </div>
        <div>
          <p className="text-lg font-bold">4.8</p>
          <p>Rating</p>
        </div>
      </div>

      {/* About Section */}
      <div className="mt-6 space-y-4 text-sm bg-white rounded-2xl p-4 shadow-md">
        <div>
          <h3 className="font-semibold text-base mb-1">About Me</h3>
          <p className="text-gray-700 leading-relaxed">
            Dr. {doctor.name} is the top most Immunologist specialist in Christ Hospital at London.
            She achieved several awards for her wonderful contribution in medical field.
            She is available for private consultation.
          </p>
        </div>

        {/* Qualification */}
        <div>
          <h3 className="font-semibold text-base mb-1">Qualification</h3>
          <p className="text-gray-700">Degree: MBBS, Sydney College and University</p>
        </div>

        {/* Service */}
        <div>
          <h3 className="font-semibold text-base mb-1">Service and Specialization</h3>
          <p className="text-gray-700">Service: Medicare</p>
          <p className="text-gray-700">Specialization: {doctor.specialty}</p>
        </div>

        {/* Availability */}
        <div>
          <h3 className="font-semibold text-base mb-1">Consulting Availability</h3>
          <p className="text-gray-700">Monday - Friday</p>
          <p className="text-gray-700">08:00 AM - 10:00 AM</p>
          <p className="text-gray-700">01:00 PM - 04:00 PM</p>
          <p className="text-gray-700">06:00 PM - 08:00 PM</p>
        </div>
      </div>

      {/* CTA Button */}
      <button className="w-full bg-blue-600 text-white py-3 rounded-xl mt-8 font-semibold text-base shadow-sm hover:bg-blue-700 transition">
        Book an Appointment
      </button>
    </div>
  );
}
