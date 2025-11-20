"use client";

import { useState } from "react";

export default function UploadForm({ onFilesSelected }) {
  const [transcriptFile, setTranscriptFile] = useState(null);
  const [referenceFile, setReferenceFile] = useState(null);
  const [warning, setWarning] = useState(""); // warning state

  const handleFileChange = (e, setter) => {
    if (e.target.files && e.target.files[0]) setter(e.target.files[0]);
  };

  const handleSubmit = () => {
    if (!transcriptFile || !referenceFile) {
      setWarning("Please upload both files."); // show warning
      return;
    }

    setWarning(""); // clear warning if both files exist

    const readFile = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsText(file);
      });

    Promise.all([readFile(transcriptFile), readFile(referenceFile)]).then(
      ([transcript, reference]) => {
        onFilesSelected(transcript, reference);
      }
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-1 font-medium text-white">Transcript (.txt)</label>
        <input
          type="file"
          accept=".txt"
          onChange={(e) => handleFileChange(e, setTranscriptFile)}
          className="border border-gray-500 p-2 rounded w-full text-black bg-white/70
             file:bg-[#246b7f] file:text-white file:rounded file:border-none 
             file:h-full file:py-1 file:px-4 file:hover:bg-blue-600 transition"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium text-white">Reference SOAP Note (.txt)</label>
        <input
          type="file"
          accept=".txt"
          onChange={(e) => handleFileChange(e, setReferenceFile)}
          className="border border-gray-500 p-2 rounded w-full text-black bg-white/70
             file:bg-[#246b7f] file:text-white file:rounded file:border-none 
             file:h-full file:py-1 file:px-4 file:hover:bg-blue-600 transition"
        />
      </div>

      {/* Warning message above the button */}
      {warning && <p className="text-red-500 font-medium">{warning}</p>}

      <button
        onClick={handleSubmit}
        className="bg-[#246b7f] hover:bg-blue-600 text-white px-4 py-2 rounded transition w-full"
      >
        Upload Files
      </button>
    </div>
  );
}
