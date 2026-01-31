'use client';

import React, { useState } from "react";

export default function PppSss() {
  const [userId, setUserId] = useState("");
  const [cookie, setCookie] = useState("");
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRewards = async () => {
    if (!userId || !cookie) {
      setError("Both User ID and Cookie are required");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `https://ps.bitsathy.ac.in/api/ps_v2/activity/rewards/breakdown?id=1&user_id=${userId}`,
        {
          method: "GET",
          headers: {
            // keeping SAME as curl (allowed + requested)
            "accept": "application/json, text/plain, */*",
            "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
            "priority": "u=1, i",
            "referer": "https://ps.bitsathy.ac.in/dashboard",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",

            // ✅ USER PROVIDED COOKIE
            "Cookie": cookie,
          },
        }
      );

      const result = await res.json();

      if (!result.success) {
        setError("API returned failure");
        setLoading(false);
        return;
      }

      setData(result.data);

      const sum = result.data.reduce(
        (acc, cat) => acc + cat.total_earned,
        0
      );
      setTotal(sum);
    } catch (err) {
      setError("Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        <h1 className="text-3xl font-bold text-slate-800">
          Activity Rewards Breakdown
        </h1>

        {/* Inputs */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <input
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
            placeholder="Enter user_id (e.g. 7376231CS333)"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />

          <textarea
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
            rows={4}
            placeholder="Paste FULL Cookie header here"
            value={cookie}
            onChange={(e) => setCookie(e.target.value)}
          />

          <button
            onClick={fetchRewards}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
          >
            {loading ? "Fetching..." : "Fetch Rewards"}
          </button>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {/* Total */}
        {total > 0 && (
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6 rounded-xl">
            <p className="text-sm">Total Activity Points</p>
            <p className="text-3xl font-bold">{total}</p>
          </div>
        )}

        {/* Data */}
        <div className="space-y-6">
          {data.map((cat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow">
              <div className="flex justify-between mb-4">
                <h2 className="font-semibold text-slate-800">
                  {cat.category_name}
                </h2>
                <span className="text-blue-600 font-medium">
                  {cat.total_earned} pts
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="border p-2 text-left">Activity</th>
                      <th className="border p-2 text-center">Earned</th>
                      <th className="border p-2 text-center">Withheld</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cat.sources.map((s, i) => (
                      <tr key={i}>
                        <td className="border p-2">{s.points_from}</td>
                        <td className="border p-2 text-center text-green-600">
                          {s.earned}
                        </td>
                        <td className="border p-2 text-center text-red-500">
                          {s.withheld}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
