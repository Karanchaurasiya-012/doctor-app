"use client";

import { useRouter, useParams } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function PatientDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id ?? "") as string;

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

  const handleSubmit = (values: typeof initialValues) => {
    console.log("Form Submitted:", values);
    // You can send form data to server here
  };

  return (
    <div className="min-h-screen bg-white px-4 py-6 max-w-md mx-auto">
      {/* Topbar with Go Back */}
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
              {/* Full Name */}
              <div>
                <Field
                  name="name"
                  type="text"
                  placeholder="Patient Name"
                  className="w-full border rounded-xl px-4 py-2 bg-gray-100"
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Age + Gender */}
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

              {/* Problem */}
              <div>
                <Field
                  name="problem"
                  as="textarea"
                  placeholder="Write your problem"
                  className="w-full border rounded-xl px-4 py-2 bg-gray-100 h-24"
                />
                <ErrorMessage name="problem" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Relation */}
              <div>
                <Field
                  name="relation"
                  type="text"
                  placeholder="Brother/sister/mother"
                  className="w-full border rounded-xl px-4 py-2 bg-gray-100"
                />
                <ErrorMessage name="relation" component="div" className="text-red-500 text-sm" />
              </div>

              {/* Mobile */}
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
                {/* ✅ Updated Make Payment Button */}
                <button
                  type="button"
                  className="w-full border border-[#22C7F0] text-[#22C7F0] font-semibold py-3 rounded-xl"
                  onClick={() => {
                    const token = Math.floor(1000 + Math.random() * 9000); // 🔥 Dynamic Token
                    router.push(`/doctors/${id}/success?token=${token}`);
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
    </div>
  );
}
