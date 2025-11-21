"use client";
import { useState } from "react";

export default function ModelSelector({ onModelsSelected }) {
  const OPENAI_MODELS = ["Gpt oss 20b"];
  const GEMINI_MODELS = ["Gemini 2.0 flash"];

  const [openai, setOpenai] = useState("");
  const [gemini, setGemini] = useState("");
  const [warning, setWarning] = useState(""); 

  const handleSubmit = () => {
    const selected = [openai, gemini].filter(Boolean);

    if (selected.length === 0) {
      setWarning("Please select any model."); 
      return;
    }

    setWarning(""); 
    onModelsSelected(selected);
  };

  return (
    <div className="space-y-4">
      {/* OpenAI Dropdown */}
      <div>
        <label className="block mb-1 font-medium text-white">OpenAI Model</label>
        <select
          value={openai}
          onChange={(e) => setOpenai(e.target.value)}
          className="border border-gray-500 p-3.5 rounded w-full text-black bg-white/70"
        >
          <option value="">Select Model</option>
          {OPENAI_MODELS.map((model) => (
            <option key={model} value={model}>{model}</option>
          ))}
        </select>
      </div>

      {/* Gemini Dropdown */}
      <div>
        <label className="block mb-1 font-medium text-white">Gemini Model</label>
        <select
          value={gemini}
          onChange={(e) => setGemini(e.target.value)}
          className="border border-gray-500 p-3.5 rounded w-full text-black bg-white/70"
        >
          <option value="">Select Model</option>
          {GEMINI_MODELS.map((model) => (
            <option key={model} value={model}>{model}</option>
          ))}
        </select>
      </div>

      {/* Warning message */}
      {warning && <p className="text-red-500 font-medium">{warning}</p>}

      <button
        onClick={handleSubmit}
        className="bg-[#246b7f] hover:bg-blue-600 text-white px-4 py-2 rounded transition w-full"
      >
        Select Models
      </button>
    </div>
  );
}
