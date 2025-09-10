import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import EmissionsChart from "../components/EmissionsChart";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import TransportForm from "../components/forms/TransportForm";
import EnergyForm from "../components/forms/EnergyForm";
import FoodForm from "../components/forms/FoodForm";

export default function Dashboard() {
  const qc = useQueryClient();

  const activities = useQuery({
    queryKey: ["activities"],
    queryFn: async () => (await api.get("/api/v1/activities")).data as any[],
  });

  const add = useMutation({
    mutationFn: async () =>
      (
        await api.post("/api/v1/activities", {
          type: "transport",
          data: { mode: "car", km: 5 },
        })
      ).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["activities"] }),
  });

  const { total7, today, count } = useMemo(() => {
    const list = (activities.data || []) as any[];
    const now = new Date();
    const todayKey = now.toISOString().slice(0, 10);

    const total7 = list.reduce((acc, a) => {
      const daysDiff = Math.floor(
        (new Date().getTime() - new Date(a.createdAt).getTime()) / 86400000
      );
      const within7 = !isNaN(daysDiff) && daysDiff < 7;
      return within7 ? acc + Number(a.emissionsKgCO2e || 0) : acc;
    }, 0);

    const todayTotal = list
      .filter((a) => (a.createdAt || "").startsWith(todayKey))
      .reduce((acc, a) => acc + Number(a.emissionsKgCO2e || 0), 0);

    return {
      total7: Number(total7.toFixed(2)),
      today: Number(todayTotal.toFixed(2)),
      count: list.length,
    };
  }, [activities.data]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-gray-950 dark:to-gray-900">
      <Navbar />
      <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
        <header className="flex items-center justify-between py-2">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-sm text-emerald-900/70 dark:text-emerald-200/60">
              Track your progress at a glance
            </p>
          </div>
        </header>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <div className="bg-white rounded-xl border border-emerald-100 shadow-sm p-4">
            <p className="text-xs uppercase text-gray-500">Last 7 days</p>
            <p className="text-2xl font-semibold text-emerald-700">
              {total7} kg
            </p>
          </div>
          <div className="bg-white rounded-xl border border-emerald-100 shadow-sm p-4">
            <p className="text-xs uppercase text-gray-500">Today</p>
            <p className="text-2xl font-semibold text-emerald-700">
              {today} kg
            </p>
          </div>
          <div className="bg-white rounded-xl border border-emerald-100 shadow-sm p-4">
            <p className="text-xs uppercase text-gray-500">Activities</p>
            <p className="text-2xl font-semibold text-emerald-700">{count}</p>
          </div>
        </motion.div>

        {/* Add Activity */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.03 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-emerald-100 dark:border-gray-800 p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Add Activity</h2>
            <button
              onClick={() => add.mutate()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded px-3 py-1.5 text-sm transition"
            >
              Quick Add
            </button>
          </div>
          <Tabs />
        </motion.div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-emerald-100 dark:border-gray-800 p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Emissions - Last 7 Days</h2>
          </div>
          {!activities.isLoading && !activities.isError && (
            <EmissionsChart activities={activities.data || []} />
          )}
          {activities.isLoading && <p>Loading chart...</p>}
          {activities.isError && (
            <p className="text-red-600">Failed to load chart</p>
          )}
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Activities</h2>
          </div>
          {activities.isLoading && <p>Loading...</p>}
          {activities.isError && <p className="text-red-600">Failed to load</p>}
          <motion.ul
            layout
            className="divide-y divide-gray-100 dark:divide-gray-800"
          >
            <AnimatePresence initial={false}>
              {(activities.data || []).map((a: any) => (
                <motion.li
                  layout
                  key={a._id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="py-3 flex items-center justify-between hover:bg-emerald-50/50 dark:hover:bg-gray-800/50 px-2 rounded"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-sm font-semibold">
                      {String(a.type || "?")
                        .slice(0, 1)
                        .toUpperCase()}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100 capitalize">
                        {a.type}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(a.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    {Number(a.emissionsKgCO2e || 0).toFixed(2)} kg
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </motion.div>
      </div>
    </div>
  );
}

function Tabs() {
  const [tab, setTab] = useState<"transport" | "energy" | "food">("transport");
  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-lg border border-emerald-100 dark:border-gray-800 overflow-hidden">
        {(
          [
            ["transport", "Transport"],
            ["energy", "Energy"],
            ["food", "Food"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={
              "px-3 py-1.5 text-sm " +
              (tab === key
                ? "bg-emerald-600 text-white"
                : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-gray-800")
            }
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "transport" && <TransportForm />}
      {tab === "energy" && <EnergyForm />}
      {tab === "food" && <FoodForm />}
    </div>
  );
}
