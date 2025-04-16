'use client';

import React from "react";
import { ReactNode } from "react";

export default function OverlayLayout({
  children,
  maxWidth = "max-w-3xl",
}: {
  children: ReactNode;
  maxWidth?: string;
}) {
  return (
    <main className="min-h-screen p-6 flex justify-center items-center">
      <div
        className={`bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-md w-full ${maxWidth}`}
      >
        {children}
      </div>
    </main>
  );
}
