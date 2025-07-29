"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Doctor = {
  id: number;
  name: string;
  specialty: string;
  image: string;
};

export default function BookAppointmentPage() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    async function fetchDoctor() {
      const res = await fetch(`https://json-backend-8zn4.onrender.com/doctors/${id}`);
      const data = await res.json();
      setDoctor(data);
    }
    fetchDoctor();
  }, [id]);

  if (!doctor) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-white p-4 space-y-4">
      <div className="text-center">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="mx-auto w-24 h-24 rounded-full object-cover"
        />
        <h2 className="text-xl font-bold mt-2">{doctor.name}</h2>
        <p className="text-sm text-gray-500">{doctor.specialty}</p>
        <p className="text-sm text-gray-500">The Wiscon Hospital in California, US</p>
      </div>

      <div className="flex justify-around text-center text-sm text-gray-600">
        <div>
          <p className="font-bold text-lg">5,000+</p>
          <p>Patients</p>
        </div>
        <div>
          <p className="font-bold text-lg">10+</p>
          <p>Years exper..</p>
        </div>
        <div>
          <p className="font-bold text-lg">4.8</p>
          <p>Rating</p>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <h3 className="font-semibold text-base">About Me</h3>
        <p>
          Dr. {doctor.name} is the top most Immunologist specialist in Christ Hospital at London.
          She achieved several awards for her wonderful contribution in medical field. She is
          available for private consultation.
        </p>

        <h3 className="font-semibold mt-4">Qualification</h3>
        <p>Degree: MBBS, Sydney college and university</p>

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
