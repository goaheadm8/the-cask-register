'use client';

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [partnersDropdownOpen, setPartnersDropdownOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  
  const partnersRef = useRef(null);
  const accountRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user?.id) {
        const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
        setRole(data?.role ?? null);
      }
    };
    fetchUser();

    // Handle clicks outside dropdowns
    const handleClickOutside = (event) => {
      if (partnersRef.current && !partnersRef.current.contains(event.target)) {
        setPartnersDropdownOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    setAccountDropdownOpen(false);
  };

  const roleCTA = () => {
    if (role === 'broker') return <Link href="/dashboard">Dashboard</Link>;
    if (role === 'warehouse') return <Link href="/submit-events">Submit Events</Link>;
    if (role === 'collector') return <Link href="/my-casks">My Casks</Link>;
    if (role === 'distillery') return <Link href="/log-events">Log Events</Link>;
    return null;
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? "backdrop-blur-md bg-white/70 py-2 shadow-sm" : "backdrop-blur-md bg-white/50 py-6"
    }`}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-serif font-bold w-1/3">
          CaskMark
        </Link>

        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link href="/">
            <Image
              src="/images/Detailed%20Logo.png"
              alt="Caskmark logo"
              width={scrolled ? 38 : 80}
              height={scrolled ? 38 : 80}
              className="transition-all duration-300"
              priority
            />
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/">Home</Link>
          <Link href="/how-it-works">How It Works</Link>
          
          {/* Partners dropdown with click handling */}
          <div className="relative" ref={partnersRef}>
            <button 
              onClick={() => setPartnersDropdownOpen(!partnersDropdownOpen)}
              onMouseEnter={() => setPartnersDropdownOpen(true)}
              className="flex items-center focus:outline-none"
            >
              Partners <ChevronDown className="ml-1 w-4 h-4" />
            </button>
            {partnersDropdownOpen && (
              <div 
                className="absolute bg-white text-black shadow-md mt-2 py-2 rounded-md w-48 z-10"
                onMouseLeave={() => setTimeout(() => setPartnersDropdownOpen(false), 300)}
              >
                <Link href="/partners/brokers" className="block px-4 py-2 hover:bg-gray-100">Brokers</Link>
                <Link href="/partners/warehouses" className="block px-4 py-2 hover:bg-gray-100">Warehouses</Link>
                <Link href="/partners/appraisers" className="block px-4 py-2 hover:bg-gray-100">Appraisers/Insurers</Link>
              </div>
            )}
          </div>
          
          <Link href="/technology">Technology</Link>

          {user ? (
            <>
              {roleCTA()}
              {/* Account dropdown with click handling */}
              <div className="relative" ref={accountRef}>
                <button 
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  onMouseEnter={() => setAccountDropdownOpen(true)}
                  className="flex items-center focus:outline-none"
                >
                  My Account <ChevronDown className="ml-1 w-4 h-4" />
                </button>
                {accountDropdownOpen && (
                  <div 
                    className="absolute bg-white text-black shadow-md mt-2 py-2 rounded-md w-40 z-10 right-0"
                    onMouseLeave={() => setTimeout(() => setAccountDropdownOpen(false), 300)}
                  >
                    <Link href="/myaccount" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="py-2">Login</Link>
              <Link href="/get-access" className="bg-white text-black px-4 py-2 rounded hover:bg-gray-100">
                Get Access
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-5 space-y-5 text-sm font-medium px-4 pb-5">
          <Link href="/" className="block py-1">Home</Link>
          <Link href="/how-it-works" className="block py-1">How It Works</Link>
          <details>
            <summary className="cursor-pointer py-1">Partners</summary>
            <div className="ml-4 space-y-2 mt-2">
              <Link href="/partners/brokers" className="block py-1">Brokers</Link>
              <Link href="/partners/warehouses" className="block py-1">Warehouses</Link>
              <Link href="/partners/appraisers" className="block py-1">Appraisers/Insurers</Link>
            </div>
          </details>
          <Link href="/technology" className="block py-1">Technology</Link>
          {user ? (
            <>
              {roleCTA() && <div className="block py-1">{roleCTA()}</div>}
              <details>
                <summary className="cursor-pointer py-1">My Account</summary>
                <div className="ml-4 space-y-2 mt-2">
                  <Link href="/myaccount" className="block py-1">Profile</Link>
                  <button onClick={handleLogout} className="block py-1">Logout</button>
                </div>
              </details>
            </>
          ) : (
            <>
              <Link href="/login" className="block py-1">Login</Link>
              <Link href="/get-access" className="block py-1">Get Access</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}