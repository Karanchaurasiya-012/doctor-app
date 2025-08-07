"use client";

import { useEffect, useState } from "react";

// ✅ Extended type for status + cancelReason
type Appointment = {
  id: string;
  doctorId: string | number;
  patientName: string;
  age: number | string;
  gender: string;
  mobile: string;
  date: string;
  token: string;
  status?: "pending" | "confirmed" | "cancelled"; // ✅ added
  cancelReason?: string; // ✅ added
};

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  availableToday: boolean;
  description: string;
  timing: string;
  image: string;
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  const fetchDoctors = async () => {
    try {
      const res = await fetch("https://json-backend-8zn4.onrender.com/doctors");
      if (!res.ok) throw new Error("Failed to fetch doctors");
      const data: Doctor[] = await res.json();
      setDoctors(data);
    } catch (e) {
      console.error(e);
      setError("Unable to load doctor info.");
    } finally {
      setLoadingDoctors(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await fetch("https://json-backend-8zn4.onrender.com/appointments");
      if (!res.ok) throw new Error("Failed to fetch appointments");
      const data: Appointment[] = await res.json();
      setAppointments(data);
    } catch (e) {
      console.error(e);
      setError((prev) => prev || "Unable to load appointments.");
    } finally {
      setLoadingAppointments(false);
    }
  };

  useEffect(() => {
    void Promise.all([fetchDoctors(), fetchAppointments()]);
  }, []);

  const requestCancel = (appt: Appointment) => {
    setSelectedAppt(appt);
    setCancelReason("");
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    if (!selectedAppt) return;
    if (cancelReason.trim() === "") {
      alert("Please provide a reason for cancellation.");
      return;
    }

    try {
      // ✅ Change from DELETE to PATCH to update status + reason
      const res = await fetch(
        `https://json-backend-8zn4.onrender.com/appointments/${selectedAppt.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "cancelled",
            cancelReason: cancelReason.trim(),
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to cancel appointment");

      await fetchAppointments();
      setShowCancelModal(false);
      setSelectedAppt(null);
    } catch (e) {
      console.error(e);
      alert("Failed to cancel appointment. Try again.");
    }
  };

  const getDoctorName = (doctorId: string | number) => {
    const idStr = String(doctorId);
    const doc = doctors.find((d) => d.id === idStr);
    return doc ? doc.name : "Unknown Doctor";
  };

  return (
    <div className="min-h-screen px-4 py-6 bg-gray-50">
      <h1 className="text-xl font-bold mb-4">Your Appointments</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      {loadingDoctors || loadingAppointments ? (
        <p className="text-gray-600">Loading...</p>
      ) : appointments.length === 0 ? (
        <p className="text-gray-500">No appointments booked yet.</p>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="p-4 bg-white rounded-xl shadow-md space-y-1 flex flex-col"
            >
              <div className="flex justify-between">
                <div>
                  <h2 className="font-bold text-lg">{appt.patientName}</h2>
                  <p className="text-sm text-gray-600">
                    Doctor: {getDoctorName(appt.doctorId)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Age: {appt.age} | Gender: {appt.gender}
                  </p>
                  <p className="text-sm">Mobile: {appt.mobile}</p>
                  <p className="text-sm text-green-600 font-medium">
                    Token: {appt.token}
                  </p>
                  <p className="text-xs text-gray-500">
                    Date: {new Date(appt.date).toLocaleString()}
                  </p>

                  {/* ✅ Status label */}
                  {appt.status === "pending" && (
                    <p className="text-yellow-600 text-sm font-medium mt-1">
                      Pending confirmation
                    </p>
                  )}
                  {appt.status === "confirmed" && (
                    <p className="text-green-600 text-sm font-medium mt-1">
                      Confirmed
                    </p>
                  )}
                  {appt.status === "cancelled" && (
                    <p className="text-red-500 text-sm font-medium mt-1">
                      Cancelled: {appt.cancelReason || "No reason given"}
                    </p>
                  )}
                </div>

                {/* ✅ Show cancel only if not already cancelled */}
                {appt.status !== "cancelled" && (
                  <div className="flex items-start">
                    <button
                      onClick={() => requestCancel(appt)}
                      className="text-red-500 font-semibold underline text-sm ml-4"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Reason Modal */}
      {showCancelModal && selectedAppt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6 space-y-4">
            <h2 className="text-lg font-bold">Cancel Appointment</h2>
            <p className="text-sm text-gray-700">
              Aap sach mein appointment cancel karna chahte hain for{" "}
              <strong>{selectedAppt.patientName}</strong> with{" "}
              <strong>{getDoctorName(selectedAppt.doctorId)}</strong> on{" "}
              <strong>{new Date(selectedAppt.date).toLocaleString()}</strong>?
            </p>
            <div>
              <label className="block text-sm font-medium mb-1">
                Reason for cancellation
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Type your reason..."
                className="w-full border rounded-md px-3 py-2 h-24 resize-none"
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
    </div>
  );
}
