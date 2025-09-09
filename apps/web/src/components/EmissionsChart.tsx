import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { useMemo } from 'react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

type Activity = { type: string; data: any; createdAt: string; emissionsKgCO2e?: number };

function estimateEmissions(a: Activity): number {
  if (typeof a.emissionsKgCO2e === 'number' && a.emissionsKgCO2e > 0) return a.emissionsKgCO2e;
  if (a.type === 'transport') {
    const mode = a.data?.mode ?? 'car';
    const km = Number(a.data?.km ?? 0);
    const factors: Record<string, number> = { car: 0.171, public: 0.05, bike: 0, walk: 0 };
    const f = factors[mode] ?? 0.171;
    return km * f;
  }
  if (a.type === 'energy') {
    const kwh = Number(a.data?.kwh ?? 0);
    return kwh * 0.4; // kg CO2e per kWh (rough avg)
  }
  if (a.type === 'food') {
    const meals = Number(a.data?.meals ?? 1);
    return meals * 2; // placeholder
  }
  return 0;
}

export default function EmissionsChart({ activities }: { activities: Activity[] }) {
  const { labels, values } = useMemo(() => {
    const days = 7;
    const today = new Date();
    const labels: string[] = [];
    const totals: number[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
      labels.push(d.toLocaleDateString());
      const sum = (activities || [])
        .filter((a) => (a.createdAt || '').startsWith(key))
        .reduce((acc, a) => acc + estimateEmissions(a), 0);
      totals.push(Number(sum.toFixed(2)));
    }
    return { labels, values: totals };
  }, [activities]);

  const data = {
    labels,
    datasets: [
      {
        label: 'Daily Emissions (kg CO2e) — last 7 days',
        data: values,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: true }, tooltip: { enabled: true } },
    scales: { y: { beginAtZero: true } },
  } as const;

  return <Line data={data} options={options} />;
}

