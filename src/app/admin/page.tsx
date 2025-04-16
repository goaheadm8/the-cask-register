'use client';

import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { supabase } from "../../lib/supabaseClient";
import React from "react";

interface Cask {
  id: string;
  cask_id: string;
  distillery: string;
  whisky: string;
  fill_date: string;
  warehouse: string;
  owner: string;
  hash: string;
  created_at: string;
}

export default function AdminPage() {
  const [casks, setCasks] = useState<Cask[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCasks = async () => {
      const { data, error } = await supabase
        .from("casks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading casks:", error);
      } else {
        setCasks(data as Cask[]);
      }

      setLoading(false);
    };

    fetchCasks();
  }, []);

  const filteredCasks = casks.filter((cask) =>
    (cask?.cask_id ?? "")
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const downloadCSV = () => {
    const headers = [
      "Cask ID",
      "Distillery",
      "Whisky",
      "Fill Date",
      "Warehouse",
      "Owner"
    ];

    const rows = filteredCasks.map((cask) => [
      cask.cask_id,
      cask.distillery,
      cask.whisky,
      cask.fill_date,
      cask.warehouse,
      cask.owner
    ]);

    const csvContent =
      [headers, ...rows]
        .map(row => row.map(item => `"${item}"`).join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "casks.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout>
      <h2 className="text-2xl font-semibold mb-4">Submitted Casks</h2>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by Cask ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full max-w-xs"
        />

        <button
          onClick={downloadCSV}
          className="ml-4 px-4 py-2 bg-[#2f1b0c] text-white rounded hover:bg-[#442c1c]"
        >
          Export CSV
        </button>
      </div>

      {loading ? (
        <p>Loading casks...</p>
      ) : filteredCasks.length === 0 ? (
        <p>No matching casks found.</p>
      ) : (
        <div className="overflow-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2 border">Cask ID</th>
                <th className="p-2 border">Distillery</th>
                <th className="p-2 border">Whisky</th>
                <th className="p-2 border">Fill Date</th>
                <th className="p-2 border">Warehouse</th>
                <th className="p-2 border">Owner</th>
              </tr>
            </thead>
            <tbody>
              {filteredCasks.map((cask) => (
                <tr key={cask.id} className="even:bg-gray-50">
                  <td className="p-2 border">{cask.cask_id}</td>
                  <td className="p-2 border">{cask.distillery}</td>
                  <td className="p-2 border">{cask.whisky}</td>
                  <td className="p-2 border">{cask.fill_date}</td>
                  <td className="p-2 border">{cask.warehouse}</td>
                  <td className="p-2 border">{cask.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
