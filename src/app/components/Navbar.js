"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full flex justify-between items-center px-10 py-4 bg-[rgba(10,123,155,0.5)] shadow-md">
      <div className="text-3xl font-serif font-bold text-white">
        MedDraft
      </div>

      <div className="flex gap-8 text-lg font-medium">
        <Link href="/" className="hover:text-blue-800 transition text-white">
          Home
        </Link>

        
      </div>
    </nav>
  );
}
