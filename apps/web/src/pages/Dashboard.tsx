import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { clearToken } from "../lib/auth";
import { useNavigate } from "react-router-dom";
import EmissionsChart from "../components/EmissionsChart";

export default function Dashboard() {
  const qc = useQueryClient();
  const nav = useNavigate();

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        <header className="flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button
            className="text-sm text-red-600"
            onClick={() => {
              clearToken();
              nav("/login");
            }}
          >
            Sign out
          </button>
        </header>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Emissions - Last 7 Days</h2>
            <button
              onClick={() => add.mutate()}
              className="bg-emerald-600 text-white rounded px-3 py-1"
            >
              Quick Add
            </button>
          </div>
          {!activities.isLoading && !activities.isError && (
            <EmissionsChart activities={activities.data || []} />
          )}
          {activities.isLoading && <p>Loading chart...</p>}
          {activities.isError && (
            <p className="text-red-600">Failed to load chart</p>
          )}
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Recent Activities</h2>
          </div>
          {activities.isLoading && <p>Loading...</p>}
          {activities.isError && <p className="text-red-600">Failed to load</p>}
          <ul className="space-y-2">
            {(activities.data || []).map((a: any) => (
              <li
                key={a._id}
                className="border rounded px-3 py-2 text-sm flex items-center justify-between"
              >
                <span>{a.type}</span>
                <span className="text-gray-500">
                  {new Date(a.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
