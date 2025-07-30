// ✅ Server Component
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ImageWithFallback from "../../../components/ImageWithFallback";

type Doctor = {
  id: number;
  name: string;
  specialty: string;
  image: string;
};

async function getDoctor(id: string): Promise<Doctor | null> {
  const res = await fetch(`https://json-backend-8zn4.onrender.com/doctors/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function DoctorDetail({ params }: Props) {
  const doctor = await getDoctor(params.id);
  if (!doctor) return notFound();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center px-4 py-4 bg-cyan-500 text-white font-medium">
        <Link href="/doctors">
          <ArrowLeft className="mr-3 cursor-pointer" />
        </Link>
        <h2 className="text-lg">Book Appointment</h2>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Doctor Info */}
        <div className="bg-white rounded-xl shadow-md p-4 flex items-center space-x-4">
          <ImageWithFallback
            src={doctor.image}
            fallbackSrc={`/images/doctor${doctor.id}.jpg`} // ✅ fallback added here
            alt={doctor.name}
            width={80}
            height={80}
            className="w-20 h-20 rounded-xl object-cover"
          />
          <div>
            <h3 className="text-xl font-bold">{doctor.name}</h3>
            <p className="text-gray-500">{doctor.specialty}</p>
            <p className="text-green-600 text-sm font-medium">MBBS, MS (Surgeon)</p>
            <p className="text-gray-400 text-sm">Fellow of Sanskara Netralaya, Chennai</p>
          </div>
        </div>

        {/* Speciality Tags */}
        <div>
          <h4 className="font-bold mb-2">Speciality</h4>
          <div className="flex flex-wrap gap-2 text-sm">
            {[
              "Cataract specialist",
              "Eye diabetes",
              "Conjunctivitis",
              "Pre cataract",
              "Foreign body",
              "Eye check up",
              "Refraction",
            ].map((tag) => (
              <span key={tag} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* About Doctor */}
        <div>
          <h4 className="font-bold mb-1">About Doctor</h4>
          <p className="text-gray-600 text-sm">
            15+ years of experience in all aspects of cardiology, including non-invasive
            and interventional procedures.
          </p>
        </div>

        {/* Availability */}
        <div>
          <h4 className="font-bold mb-1">Availability For Consulting</h4>
          <p className="text-gray-600 text-sm">Monday to Friday | 10 PM to 1 PM</p>
          <p className="text-gray-600 text-sm">Saturday | 2 PM to 5 PM</p>
        </div>

        {/* Appointment Box */}
        <div className="border p-3 rounded-xl shadow-sm flex justify-between items-center">
          <div>
            <p className="text-blue-600 text-sm font-semibold">
              Earliest Available Appointment
            </p>
            <p className="text-sm">10 Oct, 2023 | 11:30 AM</p>
          </div>
          <span className="text-2xl">➡️</span>
        </div>

        {/* Book Button */}
        <Link href={`/doctors/${doctor.id}/book`}>
          <button className="w-full bg-blue-600 text-white py-3 rounded-xl mt-4 font-semibold">
            Book an Appointment
          </button>
        </Link>
      </div>
    </div>
  );
}
