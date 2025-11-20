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
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#ffffff" }, // legend text color
      },
      tooltip: {
        titleColor: "#ffffff",
        bodyColor: "#ffffff", // tooltip text color
      },
    },
    scales: {
      x: {
        ticks: { color: "#ffffff" }, // x-axis labels
        grid: { color: "rgba(255,255,255,0.2)" }, // x-axis grid
      },
      y: {
        ticks: { color: "#ffffff" }, // y-axis labels
        grid: { color: "rgba(255,255,255,0.2)" }, // y-axis grid
      },
    },
  };

  return (
    <div className="p-4 bg-gray-600/90 shadow rounded">
      <Bar data={data} options={options} />
    </div>
  );
}
