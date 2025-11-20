"use client";
import { useState } from "react";

export default function ModelSelector({ onModelsSelected }) {
  const OPENAI_MODELS = ["Gpt oss 20b"];
  const GEMINI_MODELS = ["Gemini 2.0 flash"];

  const [openai, setOpenai] = useState("");
  const [gemini, setGemini] = useState("");

  const handleSubmit = () => {
    const selected = [openai, gemini].filter(Boolean);
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
          className="border border-gray-500 p-2.5 m-0.5 rounded w-full text-white bg-gray-600/90"
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
          className="border border-gray-500 p-2.5 rounded w-full text-white bg-gray-600/90"
        >
          <option value="">Select Model</option>
          {GEMINI_MODELS.map((model) => (
            <option key={model} value={model}>{model}</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSubmit}
        className=" bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition w-full"
      >
        Select Models
      </button>
    </div>
  );
}
