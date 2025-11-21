"use client";

import { useState, useEffect } from "react";
import UploadForm from "./UploadForm";
import ModelSelector from "./ModelSelector";
import ResultsList from "./ResultsList";
import MetricChart from "./MetricChart";
import Navbar from "./Navbar";
import { useRouter } from "next/navigation";

export default function MainApp() {
  
  /* The Main page where soap notes are generated and results are shown */

  const [transcript, setTranscript] = useState("");
  const [reference, setReference] = useState("");
  const [models, setModels] = useState([]);
  const [results, setResults] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
const [evaluated, setEvaluated] = useState(false);
   const [calculatedMetrics, setCalculatedMetrics] = useState([]); // store metrics temporarily
   const router = useRouter();
   const handleModelsSelected = (selectedModels) => {
    setModels(selectedModels);

    if (selectedModels.length > 0) {
      setShowToast(true);
      setToastMessage(`Models Selected: ${selectedModels.join(", ")}`);
      setTimeout(() => setShowToast(false), 3000); // hide after 3 seconds
    }
  };

  const handleFilesUpload = (transcriptFile, referenceFile) => {
    setTranscript(transcriptFile);
    setReference(referenceFile);

    const files = [transcriptFile, referenceFile].filter(Boolean);
    if (files.length > 0) {
      setToastMessage(`Files Uploaded`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };
  
  const handleGenerate = async () => {
    if (!transcript || !reference) {
      setResults([{ soapNote: "Please upload both transcript and reference SOAP note!", model: "Error", metrics: {} }]);
      return;
    }
    if (!models.length) {
      setResults([{ soapNote: "Please select a model!", model: "Error", metrics: {} }]);
      return;
    }

    setLoading(true);
    setResults([]);
    setMetrics([]); // clear previous metrics

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, reference, models }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setResults([{ soapNote: data.error || "Temporary failure. Please try again.", model: "Error", metrics: {} }]);
        setLoading(false);
        return;
      }

      if (data.results && data.results.length > 0) {
        const newResults = data.results.map((result) => ({
          transcript,
          reference,
          soapNote: result.soapNote || (result.error ? result.error : "No content generated"),
          model: result.model,
          metrics: result.metrics, 
        }));
        setResults(newResults);
    localStorage.setItem("results", JSON.stringify(newResults));

        const newMetrics = data.results.map((result) => ({
          model: result.model,
          bleu: result.metrics?.bleu ?? 0,
          accuracy: result.metrics?.accuracy ?? 0,
          cosine: result.metrics?.cosine ?? 0,
        }));
        setCalculatedMetrics(newMetrics);

      } else {
        setResults([{ soapNote: "No SOAP notes generated.", model: "Info", metrics: {} }]);
      }

    } catch (err) {
      console.error(err);
      setResults([{ soapNote: "Network or unexpected error occurred. Please try again.", model: "Error", metrics: {} }]);
    } finally {
      setLoading(false);
    }
  };

 const handleEvaluate = () => {
    if (calculatedMetrics.length) {
      setMetrics(calculatedMetrics);
      setEvaluated(true);
      localStorage.setItem("metrics", JSON.stringify(calculatedMetrics)); 
    }
  };


  const handleDownloadJSON = () => {
  const dataToExport = { results, metrics };
  const jsonString = JSON.stringify(dataToExport, null, 2); // pretty print
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "meddraft_results.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

useEffect(() => {
  const savedResults = JSON.parse(localStorage.getItem("results"));
  const savedMetrics = JSON.parse(localStorage.getItem("metrics"));
  if (savedResults) setResults(savedResults);
  if (savedMetrics){
     setMetrics(savedMetrics);
     setEvaluated(true);
  }
}, []);
const handleClear = () => {
  setResults([]);
  setMetrics([]);
  setCalculatedMetrics([]);
  setTranscript("");
  setReference("");
  setModels([]);
  localStorage.removeItem("results");
  localStorage.removeItem("metrics");
  setShowToast(true);
  setToastMessage("All data cleared");
  setTimeout(() => setShowToast(false), 3000);
};

  return (
    <div
      className="min-h-screen bg-cover bg-center relative  bg-[#effcff]"
    >
      <Navbar className="relative z-20"/>
       {/* Toast */}
      {showToast && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-[#246b7f] text-white px-4 py-2 rounded shadow-lg z-50">
          {toastMessage}
        </div>
      )}
      {/* Overlay */}
      <div className="absolute inset-0 pointer-events-none" ></div>

      <div className="relative z-10 p-8">

        {/* Forms Row */}
        <div className="grid md:grid-cols-2 gap-6 mb-6 mt-8">
          {/* Upload Form */}
          <div className="  bg-[rgba(10,123,155,0.5)]/80 backdrop-blur-md shadow-lg rounded-xl p-6 text-white">
            <h2 className="text-xl font-semibold mb-2">Upload Files</h2>
            <UploadForm onFilesSelected={handleFilesUpload} />
          </div>

          {/* Model Selector */}
          <div className=" bg-[rgba(10,123,155,0.5)]/80 backdrop-blur-md shadow-lg rounded-xl p-6 text-white">
            <h2 className="text-xl font-semibold mb-2">Select Models</h2>
            <ModelSelector onModelsSelected={handleModelsSelected} />
          </div>
        </div>

       {/* Generate and Download Buttons */}
<div className="mb-12 mt-12 flex justify-center gap-4 max-w-md mx-auto my-5">
  <button
    onClick={handleGenerate}
    disabled={!transcript || !reference || models.length === 0 || loading}
    className={`flex-1 py-4 rounded-xl font-semibold transition
      ${!transcript || !reference || models.length === 0
        ? "bg-gray-400 cursor-not-allowed text-gray-200"
        : " bg-blue-500 hover:bg-blue-600 text-white"
      }`}
  >
    {loading ? "Generating..." : "Generate SOAP Notes"}
  </button>

  <button
    onClick={handleDownloadJSON}
    disabled={results.length === 0}
    className={`flex-1 py-4 rounded-xl font-semibold transition
      ${results.length === 0
        ? "bg-gray-400 cursor-not-allowed text-gray-200"
        : " bg-blue-500 hover:bg-blue-600 text-white"
      }`}
  >
    Download JSON
  </button>
</div>

        {/* Results and Metrics */}
        <div className="grid md:grid-cols-2 gap-6 mb-5 mt-5">
          {/* Generated SOAP Notes */}
          <div className=" bg-[rgba(10,123,155,0.5)]/80 backdrop-blur-md shadow-lg rounded-xl p-6 text-white">
            <h2 className="text-xl font-semibold mb-4 text-white">Generated SOAP Notes</h2>
            {results.length === 0 ? (
              <p className="flex justify-center items-center text-white h-64">No SOAP notes generated yet.</p>
            ) : (
              <ResultsList results={results} />
            )}
          </div>

          {/* Metrics */}
          <div className="bg-[rgba(10,123,155,0.5)]/80 backdrop-blur-md shadow-lg rounded-xl p-6 text-white">
            <h2 className="text-xl font-semibold mb-4">Metrics</h2>
            {metrics.length === 0 ? (
              <div className="flex justify-center items-center h-64 text-white">
                <p>Graph will appear here after evaluating results.</p>
              </div>
            ) : (
              <MetricChart metrics={metrics} />
            )}
          </div>
        </div>
        {results.length > 0 && (
  <div className="mb-12 mt-12 flex justify-center gap-4 max-w-md mx-auto my-5">
    <button
      onClick={handleEvaluate}
      className="w-60 py-1 rounded-xl font-semibold bg-blue-500 hover:bg-blue-600 text-white transition"
    >
      Evaluate
    </button>
    <button
  onClick={() => router.push("/Charts")} // lowercase route
  disabled={!evaluated}
  className={`w-60 py-1 rounded-xl font-semibold transition
    ${!evaluated
      ? "bg-gray-400 cursor-not-allowed text-gray-200"
      : "bg-blue-500 hover:bg-blue-600 text-white"
    }`}
>
  View Detailed Charts
</button>
<button
    onClick={handleClear}
    className="w-60 py-1 rounded-xl font-semibold bg-blue-500 hover:bg-blue-600 text-white transition"
  >
    Clear All
  </button>
  </div>
)}

      </div>
    </div>
  );
}
