"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ImageWithFallback from "@/components/ImageWithFallback";

type Doctor = {
  id: number;
  name: string;
  image: string;
};

export default function ConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [dateStart, setDateStart] = useState(new Date());

  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedEveningSlot, setSelectedEveningSlot] = useState<string | null>(null);

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

  const dates = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(dateStart);
    d.setDate(d.getDate() + i);
    return {
      day: d.getDate().toString().padStart(2, "0"),
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
    };
  });

  const morningSlots = [
    "09:30 AM - 9:45AM",
    "10:00 AM - 10:15AM",
    "10:30 AM - 10:45AM",
    "11:00 AM - 11:15AM",
    "11:30 AM - 11:45AM",
    "12:00 PM - 12:15PM",
    "12:30 PM - 12:45PM",
    "01:00 PM - 01:15PM",
  ];

  const eveningSlots = [
    "03:30 PM - 03:45PM",
    "04:00 PM - 04:15PM",
    "05:00 PM - 05:15PM",
    "06:00 PM - 06:15PM",
  ];

  if (!doctor) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eaf6fd] to-[#ffffff] px-4 py-6 max-w-md mx-auto">
      <h2 className="text-lg font-bold text-[#007FE0] mb-4">Book Appointment</h2>

      {/* Doctor Card */}
      <div className="bg-white rounded-2xl shadow p-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{doctor.name}</h3>
          <p className="text-sm text-gray-500">Cardiologist - Dombivali</p>
          <p className="text-sm text-gray-400">MBBS ,MD (Internal Medicine)</p>
        </div>
        <div className="w-16 h-16 relative rounded-full overflow-hidden border shadow">
          <ImageWithFallback
            src={doctor.image}
            alt={doctor.name}
            fallbackSrc="/images/doctor.png"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Select Date */}
      <div className="mt-6">
        <p className="text-sm text-gray-600 mb-1 font-medium">Select Date</p>
        <div className="flex items-center gap-2">
          <div className="flex gap-3 overflow-x-scroll scrollbar-hide pb-2">
            {dates.map((item, i) => (
              <button
                key={i}
                onClick={() => setSelectedDate(item.day)}
                className={`w-14 text-center rounded-xl px-2 py-2 flex-shrink-0 transition ${
                  selectedDate === item.day
                    ? "bg-[#22C7F0] text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <p className="text-sm font-semibold">{item.day}</p>
                <p className="text-xs">{item.label}</p>
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => {
              const newStart = new Date(dateStart);
              newStart.setDate(newStart.getDate() + 6);
              setDateStart(newStart);
            }}
            className="text-2xl font-bold text-gray-500 hover:text-gray-700"
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Morning Slot */}
      <div className="mt-6 space-y-2">
        <p className="text-sm font-semibold text-gray-700">Select Morning Slot</p>
        <div className="grid grid-cols-2 gap-3">
          {morningSlots.map((slot, i) => (
            <button
              key={i}
              onClick={() => {
                setSelectedSlot(slot);
                setSelectedEveningSlot(null);
              }}
              className={`py-2 rounded-xl text-sm transition ${
                selectedSlot === slot
                  ? "bg-blue-500 text-white font-semibold"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      {/* Evening Slot */}
      <div className="mt-6 space-y-2">
        <p className="text-sm font-semibold text-gray-700">Select Evening Slot</p>
        <div className="grid grid-cols-2 gap-3">
          {eveningSlots.map((slot, i) => (
            <button
              key={i}
              onClick={() => {
                setSelectedEveningSlot(slot);
                setSelectedSlot(null);
              }}
              className={`py-2 rounded-xl text-sm transition ${
                selectedEveningSlot === slot
                  ? "bg-blue-500 text-white font-semibold"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      {/* ✅ Updated Book Appointment Button */}
      <button
        onClick={() => router.push(`/doctors/${id}/patient-details`)}
        className="w-full bg-[#22C7F0] text-white py-3 mt-8 rounded-xl font-semibold shadow hover:bg-[#1ba8d1] transition"
      >
        Book appointment
      </button>
    </div>
  );
}
