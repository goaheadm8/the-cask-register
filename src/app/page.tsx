import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen p-6 flex justify-center items-center">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-md w-full max-w-4xl text-center">
          {/* Hero Section */}
          <h1 className="text-5xl font-serif font-bold mb-6">The Cask Registry</h1>
          <p className="text-lg leading-relaxed mb-8">
            A modern ledger for whisky casks. Register, verify, and protect cask investments with transparent ownership records — and future-proof blockchain validation.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4 mb-12">
            <Link
              href="/register"
              className="bg-[#2f1b0c] text-white px-6 py-3 rounded hover:bg-[#442c1c] transition"
            >
              Register Your Cask
            </Link>
            <Link
              href="/cask-lookup"
              className="bg-white text-[#2f1b0c] border border-[#2f1b0c] px-6 py-3 rounded hover:bg-[#eee2d1] transition"
            >
              Lookup a Cask
            </Link>
          </div>

          {/* Why Us Section */}
          <div className="text-left space-y-6 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center">Why The Cask Registry?</h2>
            <p>
              The whisky industry is booming — and with that comes risk. The Cask Register ensures transparency, ownership integrity, and future-proof protection through blockchain-ready registration.
            </p>
            <ul className="list-disc list-inside text-[#4a3d2b]">
              <li>Prevent duplicate sales and fraud</li>
              <li>Secure, searchable cask ownership data</li>
              <li>Proof-of-existence with blockchain-ready hashing</li>
              <li>Peace of mind for private collectors and investors</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
