"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import Image from "next/image";

// ✅ Define Doctor type
type Doctor = {
  id: number;
  name: string;
  specialty: string;
  availableToday: boolean;
  description: string;
  timing: string;
  image: string;
};

// ✅ DoctorCard component (Reusable)
function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <div className="flex border rounded-2xl p-4 items-center shadow-sm hover:shadow-md transition cursor-pointer">
      <Image
        src={doctor.image}
        alt={doctor.name}
        width={80}
        height={80}
        className="w-20 h-20 rounded-xl object-cover"
      />

      <div className="ml-4 flex-1">
        <h3 className="font-bold text-lg">{doctor.name}</h3>
        <p className="text-blue-500 text-sm">{doctor.specialty}</p>

        <p className="mt-1 inline-block bg-green-100 text-green-600 text-xs px-2 py-1 rounded-md">
          {doctor.availableToday ? "Available today" : "Not available"}
        </p>

        <p className="text-sm text-gray-500 mt-1 line-clamp-1">
          {doctor.description}
        </p>

        <p className="text-xs bg-gray-100 text-gray-700 px-2 py-1 inline-block rounded mt-2">
          {doctor.timing}
        </p>
      </div>

      <Heart className="text-gray-400 ml-2" />
    </div>
  );
}

// ✅ Main DoctorsPage component
export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("https://json-backend-8zn4.onrender.com/doctors");
        const data: Doctor[] = await res.json();
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Top Greeting */}
      <div className="px-4 pt-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-semibold">Hello, Priya</h2>
            <p className="text-sm text-gray-500">📍 Dombivli, Mumbai</p>
          </div>
          <div className="relative">
            <Image
              src="https://randomuser.me/api/portraits/women/44.jpg"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
              alt="Profile"
            />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              5
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search Doctors"
          className="mt-4 w-full border rounded-xl px-4 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Doctor List */}
      <div className="mt-4 space-y-4 px-4">
        {doctors.map((doctor) => (
          <Link href={`/doctors/${doctor.id}`} key={doctor.id}>
            <DoctorCard doctor={doctor} />
          </Link>
        ))}
      </div>

      {/* Bottom Navbar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t px-6 py-3 flex justify-between text-sm text-gray-600">
        <span className="text-blue-600 font-bold">Find a Doctor</span>
        <span>Appoint.</span>
        <span>Records</span>
        <span>Profile</span>
      </nav>
    </div>
  );
}
