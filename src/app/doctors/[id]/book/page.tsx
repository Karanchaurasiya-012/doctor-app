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
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [doctor, setDoctor] = useState<Doctor | null>(null);

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
    <div className="min-h-screen bg-white p-4 space-y-4">
      {/* Doctor Info */}
      <div className="text-center">
        <div className="mx-auto w-24 h-24 relative">
          <Image
            src={doctor.image}
            alt={doctor.name}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <h2 className="text-xl font-bold mt-3">{doctor.name}</h2>
        <p className="text-sm text-gray-500">{doctor.specialty}</p>
        <p className="text-sm text-gray-500">The Wiscon Hospital in California, US</p>
      </div>

      {/* Stats */}
      <div className="flex justify-around text-center text-sm text-gray-600">
        <div>
          <p className="font-bold text-lg">5,000+</p>
          <p>Patients</p>
        </div>
        <div>
          <p className="font-bold text-lg">10+</p>
          <p>Years Exp</p>
        </div>
        <div>
          <p className="font-bold text-lg">4.8</p>
          <p>Rating</p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm">
        <h3 className="font-semibold text-base">About Me</h3>
        <p>
          Dr. {doctor.name} is a leading Immunologist specialist in Christ Hospital, London.
          She has received numerous awards for excellence in the medical field and is
          available for private consultations.
        </p>

        <h3 className="font-semibold mt-4">Qualification</h3>
        <p>Degree: MBBS, Sydney College & University</p>

        <h3 className="font-semibold mt-4">Service and Specialization</h3>
        <p>Service: Medicare</p>
        <p>Specialization: {doctor.specialty}</p>

        <h3 className="font-semibold mt-4">Consulting Availability</h3>
        <p>Monday - Friday</p>
        <p>08:00 AM - 10:00 AM</p>
        <p>01:00 PM - 04:00 PM</p>
        <p>06:00 PM - 08:00 PM</p>
      </div>

      <button className="w-full bg-blue-600 text-white py-3 rounded-xl mt-6 font-semibold">
        Book an Appointment
      </button>
    </div>
  );
}
