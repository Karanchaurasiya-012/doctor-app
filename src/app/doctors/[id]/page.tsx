"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Info, LogOut, X } from "lucide-react";
import Image from "next/image";

type Appointment = {
  id: string;
  doctorId: string | number;
  patientName: string;
  age: number | string;
  gender: string;
  mobile: string;
  date: string;
  token: string;
  status: "pending" | "confirmed" | "cancelled";
  cancelReason?: string;
};

type Doctor = {
  id: string | number;
  name: string;
  specialty: string;
  availableToday: boolean;
  description: string;
  timing: string;
  image: string;
  email?: string;
  mobile?: string;
};

export default function DoctorDashboardTempOnPatientsRoute() {
  const params = useParams();
  const router = useRouter();
  const doctorId = Array.isArray(params?.id) ? params.id[0] : params?.id ?? "";

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [showAbout, setShowAbout] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchDoctor = async () => {
    try {
      const res = await fetch(`https://json-backend-8zn4.onrender.com/doctors?id=${doctorId}`);
      const data = await res.json();
      if (data && data.length > 0) setDoctor(data[0]);
    } catch (e) {
      console.error("Fetch doctor error:", e);
      setError("Unable to load doctor info.");
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await fetch(`https://json-backend-8zn4.onrender.com/appointments?doctorId=${doctorId}`);
      if (!res.ok) throw new Error("Failed to fetch appointments");
      const data: Appointment[] = await res.json();
      setAppointments(
        data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      );
    } catch (e) {
      console.error("Fetch appointments error:", e);
      setError("Unable to load appointments.");
    }
  };

  useEffect(() => {
    void Promise.all([fetchDoctor(), fetchAppointments()]).finally(() =>
      setLoading(false)
    );
  }, [doctorId]);

  const requestCancel = (appt: Appointment) => {
    setSelectedAppt(appt);
    setCancelReason("");
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    if (!selectedAppt) return;
    if (!cancelReason.trim()) {
      alert("Please provide a reason for cancellation.");
      return;
    }
    try {
      await fetch(`https://json-backend-8zn4.onrender.com/appointments/${selectedAppt.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "cancelled",
          cancelReason: cancelReason.trim(),
        }),
      });
      await fetchAppointments();
      setShowCancelModal(false);
      setSelectedAppt(null);
    } catch (e) {
      console.error("Cancel failed:", e);
      alert("Cancel failed. Try again.");
    }
  };

  const confirmAppointment = async (appt: Appointment) => {
    try {
      await fetch(`https://json-backend-8zn4.onrender.com/appointments/${appt.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "confirmed",
        }),
      });
      await fetchAppointments();
    } catch (e) {
      console.error("Confirm failed:", e);
      alert("Confirm failed. Try again.");
    }
  };

  const handleLogout = () => {
    router.push("/");
  };

  const filteredAppointments = appointments.filter((a) => {
    if (!search.trim()) return true;
    return a.patientName.toLowerCase().includes(search.toLowerCase());
  });
  
  const upcomingAppointments = appointments
  .filter((a) => new Date(a.date).getTime() >= Date.now())
  .filter((a) => a.status !== "cancelled");
const nextAppointment = upcomingAppointments[0] || null;

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Image
              src={doctor?.image || "/images/default-doctor.png"}
              alt={doctor?.name || "Doctor"}
              width={60}
              height={60}
              className="w-14 h-14 rounded-xl object-cover"
            />
            {doctor?.availableToday && (
              <span className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white" />
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold">{doctor?.name || "Doctor"}</h1>
            <p className="text-sm text-gray-600">{doctor?.specialty || ""}</p>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <button
            onClick={() => setShowAbout(true)}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="About"
          >
            <Info size={20} />
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow flex flex-col">
          <p className="text-sm text-gray-500">Total Appointments</p>
          <h2 className="text-2xl font-bold">{appointments.length}</h2>
          <p className="text-xs text-gray-400 mt-1">Upcoming & past both</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow flex flex-col">
          <p className="text-sm text-gray-500">Next Appointment</p>
          {nextAppointment ? (
            <div>
              <h2 className="font-semibold">{nextAppointment.patientName}</h2>
              <p className="text-xs text-gray-600">
                {new Date(nextAppointment.date).toLocaleString()}
              </p>
              <p className="text-xs">
                Token: <span className="font-medium">{nextAppointment.token}</span>
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-600">No upcoming</p>
          )}
        </div>
      </div>

      {/* Profile Summary */}
      <div className="px-4 mt-6">
        <div className="bg-white rounded-2xl shadow p-5 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg">Profile Summary</h3>
          <p className="text-sm text-gray-600">
            {doctor?.description || "No description available."}
          </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Timing</p>
              <p className="font-medium">{doctor?.timing}</p>
              <p className="text-xs mt-1">
                {doctor?.availableToday ? (
                  <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                    Available Today
                  </span>
                ) : (
                  <span className="inline-block bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
                    Not Available
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            {doctor?.email && (
              <div>
                <p className="font-semibold">Email:</p>
                <p>{doctor.email}</p>
              </div>
            )}
            {doctor?.mobile && (
              <div>
                <p className="font-semibold">Mobile:</p>
                <p>{doctor.mobile}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 mt-6">
        <div className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patient name"
            className="flex-1 border rounded-xl px-4 py-2 bg-white focus:outline-none"
          />
          <button
            onClick={() => setSearch("")}
            className="px-4 py-2 bg-gray-200 rounded-xl text-sm"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Appointment List */}
      <div className="px-4 mt-6">
        <h2 className="text-lg font-semibold mb-3">Appointments</h2>
        {loading ? (
          <div className="bg-white rounded-2xl p-6 shadow text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl p-6 shadow text-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 shadow text-center">
            <p className="text-gray-600">No appointments found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appt) => (
              <div
                key={appt.id}
                className="bg-white rounded-2xl shadow p-4 flex justify-between items-start"
              >
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-bold">{appt.patientName}</h3>
                      <p className="text-xs text-gray-600">
                        {new Date(appt.date).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600">
                        Token: {appt.token}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        Status: {appt.status}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm mt-1">
                    Age: {appt.age} | Gender: {appt.gender}
                  </p>
                  <p className="text-sm">Mobile: {appt.mobile || "N/A"}</p>
                  {appt.status === "cancelled" && appt.cancelReason && (
                    <p className="text-sm text-red-500 mt-1">
                      Cancel Reason: {appt.cancelReason}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  {appt.status === "pending" && (
                    <button
                      onClick={() => confirmAppointment(appt)}
                      className="text-green-600 text-sm font-semibold underline"
                    >
                      Confirm
                    </button>
                  )}
                  {appt.status !== "cancelled" && (
                    <button
                      onClick={() => requestCancel(appt)}
                      className="text-red-500 text-sm font-semibold underline"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && selectedAppt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-6 space-y-4 relative">
            <button
              onClick={() => {
                setShowCancelModal(false);
                setSelectedAppt(null);
              }}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100"
            >
              <X size={18} />
            </button>
            <h2 className="text-xl font-bold">Cancel Appointment</h2>
            <p className="text-sm">
              Kya aap sach mein appointment cancel karna chahte hain with{" "}
              <strong>{selectedAppt.patientName}</strong> on{" "}
              <strong>{new Date(selectedAppt.date).toLocaleString()}</strong>?
            </p>
            <div>
              <label className="block text-sm font-medium mb-1">
                Reason for cancellation
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Type reason..."
                className="w-full border rounded-md px-3 py-2 h-28 resize-none"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedAppt(null);
                }}
                className="px-4 py-2 rounded-lg border"
              >
                Close
              </button>
              <button
                onClick={confirmCancel}
                className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

        {/* About Drawer */}
      {showAbout && (
        <div className="fixed inset-0 flex">
          <div className="w-full max-w-md bg-white shadow-xl p-6 overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">About Doctor Dashboard</h2>
              <button onClick={() => setShowAbout(false)} className="p-1">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm mb-2">
              Ye temporary doctor dashboard hai jo aapko appointments ka overview,
              next upcoming, aur cancel karne ka option deta hai. Aap patient details
              dekh sakte hain aur appointment manage kar sakte hain.
            </p>
            <div className="mt-4 space-y-3 text-sm">
              <div>
                <p className="font-medium">Doctor ID:</p>
                <p>{doctor?.id || "-"}</p>
              </div>
              <div>
                <p className="font-medium">Name:</p>
                <p>{doctor?.name || "-"}</p>
              </div>
              <div>
                <p className="font-medium">Specialty:</p>
                <p>{doctor?.specialty || "-"}</p>
              </div>
              <div>
                <p className="font-medium">Timing:</p>
                <p>{doctor?.timing || "-"}</p>
              </div>
              <div>
                <p className="font-medium">Available Today:</p>
                <p>{doctor?.availableToday ? "Yes" : "No"}</p>
              </div>
              {doctor?.email && (
                <div>
                  <p className="font-medium">Email:</p>
                  <p>{doctor.email}</p>
                </div>
              )}
              {doctor?.mobile && (
                <div>
                  <p className="font-medium">Mobile:</p>
                  <p>{doctor.mobile}</p>
                </div>
              )}
              <div>
                <p className="font-medium">Total Appointments:</p>
                <p>{appointments.length}</p>
              </div>
              {nextAppointment && (
                <div>
                  <p className="font-medium">Next Appointment:</p>
                  <p>{new Date(nextAppointment.date).toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
          <div
            className="flex-1 bg-black bg-opacity-30"
            onClick={() => setShowAbout(false)}
          />
        </div>
      )}
    </div>
  );
}
