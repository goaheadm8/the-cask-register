import React from "react";

export default function Footer() {
    return (
      <footer className="bg-[#e6dfd3] text-[#2f1b0c] text-sm p-4 mt-8 shadow-inner">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2 text-center">
          <p>&copy; {new Date().getFullYear()} CaskMark. All rights reserved.</p>
          <p>Registered in Scotland 🥃</p>
        </div>
      </footer>
    );
  }
  