'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="w-full bg-[#e6dfd3] text-[#2f1b0c] p-4 shadow">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/images/logo.jpg"
            alt="The Cask Register Logo"
            width={40}
            height={40}
            className="rounded"
          />
          <span className="text-2xl font-serif font-extrabold tracking-wider">The Cask Register</span>
        </Link>
        <div className="space-x-4">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/register" className="hover:underline">Register</Link>
          <Link href="/about" className="hover:underline">About</Link>
          <Link href="/faq" className="hover:underline">FAQ</Link>
          <Link href="/cask-lookup" className="hover:underline">Cask Lookup</Link>
        </div>
      </div>
    </nav>
  );
}
