import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function MetricChart({ metrics }) {
  if (!metrics || metrics.length === 0) return null;

  const data = {
    labels: metrics.map((m) => m.model),
    datasets: [
      {
        label: "BLEU Score",
        data: metrics.map((m) => m.bleu),
        backgroundColor: function(context) {
          const gradient = context.chart.ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, "rgba(59, 130, 246, 0.8)"); // blue
          gradient.addColorStop(1, "rgba(147, 197, 253, 0.8)"); // light blue
          return gradient;
        }, 
        maxBarThickness: 50,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 14 },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#1e3a8a",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 10,
      },
      title: {
        display: true,
        text: "BLEU Scores by Model",
        font: { size: 18, weight: "bold" },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        ticks: {
          stepSize: 0.1,
          color: "#1e40af",
          font: { size: 12, weight: "bold" },
        },
        grid: {
          color: "rgba(0,0,0,0.05)",
        },
      },
      x: {
        ticks: {
          color: "#1e40af",
          font: { size: 12, weight: "bold" },
        },
        grid: {
          drawTicks: false,
          color: "rgba(0,0,0,0.05)",
        },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeOutQuart",
    },
  };

  return (
    <div className="p-6 bg-white/90 shadow-xl rounded-xl">
      <Bar data={data} options={options} />
    </div>
  );
}
