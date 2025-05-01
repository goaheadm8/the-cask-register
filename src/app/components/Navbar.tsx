'use client';

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { User } from '@supabase/supabase-js';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [partnersDropdownOpen, setPartnersDropdownOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [getStartedDropdownOpen, setGetStartedDropdownOpen] = useState(false);

  const partnersRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const getStartedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error);
        setUser(() => null);
        return;
      }
      setUser(() => data?.session?.user ?? null);
      if (data?.session?.user?.id) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.session.user.id)
          .single();
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setRole(null);
          return;
        }
        setRole(profileData?.role ?? null);
      } else {
        setRole(null);
      }
    };

    fetchUser();

    const handleClickOutside = (event: MouseEvent) => {
      if (partnersRef.current && !partnersRef.current.contains(event.target as Node)) setPartnersDropdownOpen(false);
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) setAccountDropdownOpen(false);
      if (getStartedRef.current && !getStartedRef.current.contains(event.target as Node)) setGetStartedDropdownOpen(false);
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
          <div className="relative" ref={partnersRef}>
            <button onClick={() => setPartnersDropdownOpen(!partnersDropdownOpen)} className="flex items-center focus:outline-none">
              Partners <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-300 ${partnersDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {partnersDropdownOpen && (
              <div className="absolute bg-white text-black shadow-md mt-2 py-2 rounded-md w-48 z-10">
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
              <div className="relative" ref={accountRef}>
                <button onClick={() => setAccountDropdownOpen(!accountDropdownOpen)} className="flex items-center focus:outline-none">
                  My Account <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-300 ${accountDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {accountDropdownOpen && (
                  <div className="absolute bg-white text-black shadow-md mt-2 py-2 rounded-md w-40 z-10 right-0">
                    <Link href="/myaccount" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="relative" ref={getStartedRef}>
              <button onClick={() => setGetStartedDropdownOpen(!getStartedDropdownOpen)} className="flex items-center bg-white text-black px-4 py-2 rounded hover:bg-gray-100">
                Get Started <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-300 ${getStartedDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {getStartedDropdownOpen && (
                <div className="absolute bg-white text-black shadow-md mt-2 py-2 rounded-md w-40 z-10 right-0">
                  <Link href="/login" className="block px-4 py-2 hover:bg-gray-100">Login</Link>
                  <Link href="/signup" className="block px-4 py-2 hover:bg-gray-100">Sign Up</Link>
                  <Link href="/get-access" className="block px-4 py-2 hover:bg-gray-100">Learn More</Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile menu toggle button */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
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
                <button onClick={handleLogout} className="block py-1 text-left">Logout</button>
              </div>
            </details>
          </>
        ) : (
          <>
            <details>
              <summary className="cursor-pointer py-1">Get Started</summary>
              <div className="ml-4 space-y-2 mt-2">
                <Link href="/login" className="block py-1">Login</Link>
                <Link href="/signup" className="block py-1">Sign Up</Link>
                <Link href="/get-access" className="block py-1">Learn More</Link>
              </div>
            </details>
          </>
        )}
      </div>
    )}

    </nav>
  );
}
