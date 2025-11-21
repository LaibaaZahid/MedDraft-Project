"use client";

import Navbar from "./Navbar";
import { useRouter } from "next/navigation";
import HowItWorks from "./HowItWorks";



export default function Landing() {
  const router = useRouter();
  return (
    <>
    <div
      className="relative min-h-screen bg-cover bg-center flex flex-col items-center"
      style={{ backgroundImage: "url('/landing.jpg')" }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Center Content */}
        <div className="flex flex-col justify-center items-center grow mt-12 mb-20 px-4 sm:px-6 lg:px-0">
  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-600 text-center mb-6 drop-shadow-lg mt-15">
    Simplify Your Medical Documentation
  </h1>

  <p className="text-lg sm:text-xl text-blue-500 mb-8 drop-shadow-md text-center max-w-full sm:max-w-xl">
    Upload transcripts, select AI models, and generate SOAP notes with insightful metrics.
  </p>



        <button
          onClick={() => router.push("/MainApp")}
          className="px-8 py-4 mt-8 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
        >
          Try Now
        </button>
      </div>

      {/* How It Works - at the bottom */}
      <HowItWorks />
    </div>
    

    
    </>
  );
}
