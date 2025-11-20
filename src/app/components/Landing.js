"use client";

export default function Landing({ onTry }) {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex flex-col justify-center items-center"
      style={{ backgroundImage: "url('/landing.jpg')" }}
    >
      <div className="absolute top-23 left-9 text-2xl font-bold text-white">
        MedDraft
      </div>
      <h1 className="text-5xl font-extrabold text-white text-center mb-6 drop-shadow-lg">
        Simplify Your Medical Documentation
      </h1>
      <p className="text-xl text-white mb-8 drop-shadow-md text-center max-w-xl">
        Upload transcripts, select AI models, and generate SOAP notes with insightful metrics.
      </p>
      <button
        onClick={onTry}
        className="px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
      >
        Try Now
      </button>
    </div>
  );
}
