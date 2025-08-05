"use client";

import { useRouter, useParams } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";

export default function PatientDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id ?? "") as string;

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [tokenNumber, setTokenNumber] = useState<string | null>(null);

  const initialValues = {
    name: "",
    age: "",
    gender: "Male",
    problem: "",
    relation: "",
    mobile: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().max(50, "Too long").optional(),
    age: Yup.number().min(0, "Invalid age").max(120, "Too high").optional(),
    gender: Yup.string().oneOf(["Male", "Female", "Other"]),
    problem: Yup.string().max(200, "Too long").optional(),
    relation: Yup.string().max(30, "Too long").optional(),
    mobile: Yup.string()
      .matches(/^\d{10}$/, "Mobile number must be 10 digits")
      .optional(),
  });

  const isFormEmpty = (values: typeof initialValues) => {
    return (
      values.name === "" &&
      values.age === "" &&
      values.problem === "" &&
      values.relation === "" &&
      values.mobile === ""
    );
  };

  const handleSubmit = (values: typeof initialValues) => {
    console.log("Form Submitted:", values);
    // Optional: send data to server
  };

  return (
    <div className="min-h-screen bg-white px-4 py-6 max-w-md mx-auto relative">
      {/* Topbar */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => router.back()}
          className="text-[#22C7F0] text-xl font-bold"
        >
          ←
        </button>
        <h1 className="text-center text-lg font-semibold text-[#22C7F0] flex-grow">
          Patient Details
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow p-4 space-y-4">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-4">
              {/* Fields */}
              <div>
                <Field
                  name="name"
                  type="text"
                  placeholder="Patient Name"
                  className="w-full border rounded-xl px-4 py-2 bg-gray-100"
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <Field
                    name="age"
                    type="number"
                    placeholder="Age"
                    className="w-20 border rounded-xl px-3 py-2 bg-gray-100"
                  />
                  <ErrorMessage name="age" component="div" className="text-red-500 text-sm" />
                </div>
                <div className="flex gap-2">
                  {["Male", "Female", "Other"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setFieldValue("gender", g)}
                      className={`px-3 py-2 rounded-xl border ${
                        values.gender === g ? "bg-[#22C7F0] text-white" : "bg-white text-gray-600"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Field
                  name="problem"
                  as="textarea"
                  placeholder="Write your problem"
                  className="w-full border rounded-xl px-4 py-2 bg-gray-100 h-24"
                />
                <ErrorMessage name="problem" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <Field
                  name="relation"
                  type="text"
                  placeholder="Brother/sister/mother"
                  className="w-full border rounded-xl px-4 py-2 bg-gray-100"
                />
                <ErrorMessage name="relation" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <Field
                  name="mobile"
                  type="text"
                  placeholder="Mobile number"
                  className="w-full border rounded-xl px-4 py-2 bg-gray-100"
                />
                <ErrorMessage name="mobile" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  className="w-full border border-[#22C7F0] text-[#22C7F0] font-semibold py-3 rounded-xl"
                  onClick={() => {
                    if (isFormEmpty(values)) {
                      setShowErrorModal(true);
                      return;
                    }
                    const token = Math.floor(1000 + Math.random() * 9000).toString();
                    setTokenNumber(token);
                    setShowSuccessModal(true);
                  }}
                >
                  Make Payment
                </button>

                <button
                  type="submit"
                  className="w-full bg-[#22C7F0] text-white font-semibold py-3 rounded-xl"
                >
                  Add Patient Details
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {/* ❌ Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full text-center space-y-4">
            <img src="/error.png" alt="Error" className="w-24 h-24 mx-auto" />
            <h2 className="text-xl font-bold text-red-500">Booking Failed Please Try Again</h2>
            <p className="text-gray-600 text-sm">
              May be Network delay and having some errors,
              <br /> please try again.
              <br /> Thank you...
            </p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="bg-red-500 text-white px-6 py-2 rounded-full"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* ✅ Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full text-center space-y-4">
            <img src="/success.png" alt="Success" className="w-24 h-24 mx-auto" />
            <h2 className="text-lg font-bold text-green-600">Appointment Booked</h2>
            <p className="text-gray-700">Successfully!</p>
            <p className="text-sm">
              Token No <span className="text-green-500 font-semibold">{tokenNumber}</span>
            </p>
            <p className="text-gray-500 text-sm">
              You will receive a Notification half an hour before as reminder.
              Thank you...
            </p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                router.push("/");
              }}
              className="bg-teal-500 text-white px-6 py-2 rounded-full"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
