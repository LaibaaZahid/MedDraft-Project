"use client";
import { useState } from "react";

export default function UploadForm({ onFilesSelected }) {
  const [transcriptFile, setTranscriptFile] = useState(null);
  const [referenceFile, setReferenceFile] = useState(null);

  const handleFileChange = (e, setter) => {
    if (e.target.files && e.target.files[0]) setter(e.target.files[0]);
  };

  const handleSubmit = () => {
    if (!transcriptFile || !referenceFile) return alert("Please upload both files.");

    const readFile = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsText(file);
      });

    Promise.all([readFile(transcriptFile), readFile(referenceFile)]).then(([transcript, reference]) => {
      onFilesSelected(transcript, reference);
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-1 font-medium text-white">Transcript (.txt)</label>
        <input
          type="file"
          accept=".txt"
          onChange={(e) => handleFileChange(e, setTranscriptFile)}
          className="border border-gray-500 p-2 rounded w-full text-white bg-gray-600/90
             file:bg-gray-800 file:text-white file:rounded file:border-none 
             file:h-full file:py-0 file:px-4 file:hover:bg-gray-900 transition"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium text-white">Reference SOAP Note (.txt)</label>
    <input
  type="file"
  accept=".txt"
  onChange={(e) => handleFileChange(e, setReferenceFile)}
  className="border border-gray-500 p-2 rounded w-full text-white bg-gray-600/90
             file:bg-gray-800 file:text-white file:rounded file:border-none 
             file:h-full file:py-0 file:px-4 file:hover:bg-gray-900 transition"
/>

      </div>

      <button
        onClick={handleSubmit}
        className=" bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition w-full"
      >
        Upload Files
      </button>
    </div>
  );
}
