"use client";

import { useState } from "react";
import UploadForm from "./UploadForm";
import ModelSelector from "./ModelSelector";
import ResultsList from "./ResultsList";
import MetricChart from "./MetricChart";

export default function MainApp({ goHome }) {
  const [transcript, setTranscript] = useState("");
  const [reference, setReference] = useState("");
  const [models, setModels] = useState([]);
  const [results, setResults] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(false);

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
  setResults([]); // clear previous results

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript, reference, models }),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      // Show the error directly in SOAP Notes card
      setResults([
        {
          soapNote: data.error || "Temporary failure. Please try again.",
          model: "Error",
          metrics: {},
        },
      ]);
      setLoading(false);
      return;
    }

    // If results exist
    if (data.results && data.results.length > 0) {
      const newResults = data.results.map((result) => ({
        transcript,
        reference,
        soapNote: result.soapNote || (result.error ? result.error : "No content generated"),
        model: result.model,
        metrics: result.metrics,
      }));
      setResults(newResults);

      const newMetrics = data.results.map((result) => ({
        model: result.model,
        bleu: result.metrics?.bleu ?? 0,
      }));
      setMetrics(newMetrics);

    } else {
      // If results array is empty but no error, show generic message
      setResults([{ soapNote: "No SOAP notes generated.", model: "Info", metrics: {} }]);
    }

  } catch (err) {
    console.error(err);
    setResults([{ soapNote: "Network or unexpected error occurred. Please try again.", model: "Error", metrics: {} }]);
  } finally {
    setLoading(false);
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
  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/landing.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">MedDraft</h1>
          <button
            onClick={goHome}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 font-semibold rounded-lg text-white transition"
          >
            Home
          </button>
        </div>

        {/* Forms Row */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Upload Form */}
          <div className="bg-white/10 backdrop-blur-md shadow-lg rounded-xl p-6 text-white">
            <h2 className="text-xl font-semibold mb-2">Upload Files</h2>
            <UploadForm
              onFilesSelected={(t, r) => {
                setTranscript(t);
                setReference(r);
              }}
            />
          </div>

          {/* Model Selector */}
          <div className="bg-white/10 backdrop-blur-md shadow-lg rounded-xl p-6 text-white">
            <h2 className="text-xl font-semibold mb-2">Select Models</h2>
            <ModelSelector onModelsSelected={setModels} />
          </div>
        </div>

        {/* Generate Button */}
        <div className="mb-6">
          <button
            onClick={handleGenerate}
            disabled={!transcript || !reference || models.length === 0 || loading}
            className={`w-full py-3 rounded-xl font-semibold transition
              ${!transcript || !reference || models.length === 0
                ? "bg-gray-400 cursor-not-allowed text-gray-200"
                : " bg-blue-500 hover:bg-blue-600 text-white"
              }`}
          >
            {loading ? "Generating..." : "Generate SOAP Note"}
          </button>

           <button
    onClick={handleDownloadJSON}
    className="w-full py-3 mt-4 rounded-xl font-semibold transition bg-blue-500 hover:bg-blue-600 text-white"
    disabled={results.length === 0}
  >
    Download JSON
  </button>
        </div>

        {/* Results and Metrics */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Generated SOAP Notes */}
          <div className="bg-white/10 backdrop-blur-md shadow-lg rounded-xl p-6 max-h-[450px] overflow-auto text-white">
            <h2 className="text-xl font-semibold mb-4">Generated SOAP Notes</h2>
            {results.length === 0 ? (
              <p className="text-gray-300">No SOAP notes generated yet.</p>
            ) : (
              <ResultsList results={results} />
            )}
          </div>

          {/* Metrics */}
          <div className="bg-white/10 backdrop-blur-md shadow-lg rounded-xl p-6 max-h-[450px] overflow-auto text-white">
            <h2 className="text-xl font-semibold mb-4">Metrics</h2>
            {metrics.length === 0 ? (
              <div className="flex justify-center items-center h-64 text-gray-400">
                <p>Graph will appear here after generating results.</p>
              </div>
            ) : (
              <MetricChart metrics={metrics} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
