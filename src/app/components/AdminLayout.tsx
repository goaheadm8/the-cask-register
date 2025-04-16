"use client";

import { ReactNode } from "react";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Admin Header */}
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Admin Content */}
        <div className="bg-white border rounded-lg shadow-sm p-6">
          {children}
        </div>
      </div>
    </main>
  );
}
