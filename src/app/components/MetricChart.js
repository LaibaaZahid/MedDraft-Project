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

  return (
    <div className="p-4 bg-white/90 shadow rounded">
      <Bar data={data} />
    </div>
  );
}
