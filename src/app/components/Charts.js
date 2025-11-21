"use client";

import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useRouter } from "next/navigation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function Charts() {
  const [metrics, setMetrics] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState("bleu");
const router = useRouter();
  // Fetch metrics from localStorage
  useEffect(() => {
    const savedMetrics = JSON.parse(localStorage.getItem("metrics"));
    if (savedMetrics && savedMetrics.length > 0) {
      setMetrics(savedMetrics);
    }
  }, []);

  if (!metrics || metrics.length === 0) {
    return (
      <p className="text-center mt-20 text-gray-500">
        No metrics to display. Please evaluate SOAP notes first.
      </p>
    );
  }

  const barData = {
    labels: metrics.map((m) => m.model),
    datasets: [
      {
        label: selectedMetric.toUpperCase(),
        data: metrics.map((m) => m[selectedMetric] ?? 0),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: `${selectedMetric.toUpperCase()} Comparison Across Models`,
        font: { size: 18 },
      },
      // Remove datalabels plugin entirely for clean bars
    },
    scales: {
      y: { beginAtZero: true }, // keep axis values
    },
  };

  const lineData = {
    labels: metrics.map((m) => m.model),
    datasets: [
      {
        label: selectedMetric.toUpperCase(),
        data: metrics.map((m) => m[selectedMetric] ?? 0),
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.3)",
        tension: 0.4,
        fill: true,
        pointRadius: 6,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: `${selectedMetric.toUpperCase()} Trend Across Models` },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className=" bg-[#effcff]">
    <Navbar className="relative z-20"/>
    <div className="min-h-screen bg-[#f0f7fa] flex flex-col items-center p-6">
         
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        Detailed Metrics Dashboard
      </h1>

      <div className="mb-6 flex gap-4 flex-wrap justify-center">
        {["bleu", "accuracy", "cosine"].map((metric) => (
          <button
            key={metric}
            onClick={() => setSelectedMetric(metric)}
            className={`px-4 py-2 rounded-lg font-semibold transition
              ${
                selectedMetric === metric
                  ? "bg-blue-500 text-white"
                  : "bg-white border border-blue-400 text-blue-600 hover:bg-blue-100"
              }`}
          >
            {metric.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="w-full max-w-4xl bg-white rounded-3xl p-6 shadow-lg mb-8">
        <Bar data={barData} options={barOptions} />
      </div>

      <div className="w-full max-w-4xl bg-white rounded-3xl p-6 shadow-lg">
        <Line data={lineData} options={lineOptions} />
      </div>
      {/* Back Button */}
        <button
          onClick={() => router.push("/MainApp")} // Route to MainApp
          className="px-10 py-3 mt-5 rounded-xl font-semibold bg-blue-500 hover:bg-blue-600 text-white transition"
        >
          Back
        </button>
    </div>
    </div>
  );
}
