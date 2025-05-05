'use client';

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, Bell, Sun, Moon, Search } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [partnersDropdownOpen, setPartnersDropdownOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [getStartedDropdownOpen, setGetStartedDropdownOpen] = useState(false);
  const [technologyDropdownOpen, setTechnologyDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState<{id: number, message: string, read: boolean}[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const partnersRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const getStartedRef = useRef<HTMLDivElement>(null);
  const technologyRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'es', name: 'Español' }
  ];

  // Load saved settings and data on mount
  useEffect(() => {
    // Load recent searches
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches));
      } catch (e) {
        console.error('Failed to parse saved searches');
      }
    }

    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);

    // Load language preference
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }

    // Fetch mock notifications (replace with real API call)
    setNotifications([
      { id: 1, message: 'Your cask CMGB00PMBL4G9 was verified', read: false },
      { id: 2, message: 'New cask registration available', read: false },
      { id: 3, message: 'Warehouse updated cask details', read: true }
    ]);
    setNotificationCount(2); // Unread count
  }, []);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  // Save language preference
  useEffect(() => {
    localStorage.setItem('language', currentLanguage);
  }, [currentLanguage]);

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
      if (technologyRef.current && !technologyRef.current.contains(event.target as Node)) setTechnologyDropdownOpen(false);
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) setShowRecentSearches(false);
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) setShowNotifications(false);
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) { /* Handle language ref */ }
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

  const saveSearch = (query: string) => {
    if (!query.trim()) return;
    
    setRecentSearches(prev => {
      const newSearches = [query, ...prev.filter(s => s !== query)].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(newSearches));
      return newSearches;
    });
  };

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement> | React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    // Reset error state and set loading
    setSearchError("");
    setIsSearching(true);
    
    try {
      // Save this search
      saveSearch(searchQuery.trim());
      
      // Check if the search query looks like a CaskMark ID (basic format validation)
      const caskmarkIdPattern = /^CM[A-Z0-9]{10,}$/;
      
      if (caskmarkIdPattern.test(searchQuery.trim())) {
        // It looks like a CaskMark ID, redirect to the ID page
        router.push(`/id/${searchQuery.trim()}`);
      } else {
        // First check if the ID exists
        const { data, error } = await supabase
          .from('caskmark')
          .select('caskmark_id')
          .ilike('caskmark_id', `%${searchQuery.trim()}%`)
          .limit(1);
        
        if (data && data.length > 0) {
          // Found a matching CaskMark ID
          router.push(`/id/${data[0].caskmark_id}`);
        } else {
          // No matching CaskMark ID found
          setSearchError("No matching CaskMark ID found. Format should be CMXXXXXXXX.");
          setTimeout(() => setSearchError(""), 5000); // Clear error after 5 seconds
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchError("An error occurred during search.");
      setTimeout(() => setSearchError(""), 5000);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    } else if (e.key === 'Escape') {
      setShowRecentSearches(false);
    } else if (e.key === 'ArrowDown' && showRecentSearches && recentSearches.length > 0) {
      // Handle arrow down navigation through recent searches
      e.preventDefault();
      // Implementation for keyboard navigation would go here
    }
  };

  const handleRecentSearchClick = (search: string) => {
    setSearchQuery(search);
    setShowRecentSearches(false);
    // Trigger search with the selected item
    const formEvent = { preventDefault: () => {} } as React.FormEvent;
    handleSearch(formEvent);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setNotificationCount(0);
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const roleCTA = () => {
    if (role === 'broker') return <Link href="/dashboard">Dashboard</Link>;
    if (role === 'warehouse') return <Link href="/submit-events">Submit Events</Link>;
    if (role === 'collector') return <Link href="/my-casks">My Casks</Link>;
    if (role === 'distillery') return <Link href="/log-events">Log Events</Link>;
    return null;
  };

  // Updated layout for the navbar header section
  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? "bg-white/90 py-2 shadow-sm" : "bg-white/80 py-4"
    }`}>
      <div className="w-full px-6 flex items-center justify-between">
        {/* Left section with brand and search */}
        <div className="flex items-center">
          <Link href="/" className="text-xl font-serif font-bold mr-4">
            CaskMark
          </Link>
          <div className="relative hidden sm:block ml-2" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative">
              <input 
                type="text" 
                placeholder="Search CaskMark ID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => setShowRecentSearches(true)}
                className="pl-8 pr-10 py-1.5 rounded-full text-sm border border-gray-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 w-40 lg:w-56"
              />
              <button 
                type="submit"
                className="absolute right-1.5 top-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-full w-5 h-5 flex items-center justify-center"
                aria-label="Search"
              >
                <Search className="h-3 w-3" />
              </button>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              
              {isSearching && (
                <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </form>
            
            {searchError && (
              <div className="absolute top-full mt-1 left-0 right-0 bg-red-100 text-red-600 text-xs p-1 rounded shadow-sm">
                {searchError}
              </div>
            )}
            
            {showRecentSearches && recentSearches.length > 0 && (
              <div className="absolute top-full mt-1 left-0 right-0 bg-white text-gray-900 rounded-md shadow-lg py-1 z-20">
                <div className="px-3 py-1 text-xs text-gray-500 font-medium">Recent Searches</div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100"
                    onClick={() => handleRecentSearchClick(search)}
                  >
                    {search}
                  </button>
                ))}
                <div className="border-t border-gray-200 mt-1 pt-1">
                  <button 
                    className="block w-full text-left px-3 py-1.5 text-xs text-amber-600 hover:text-amber-700"
                    onClick={() => {
                      setRecentSearches([]);
                      localStorage.removeItem('recentSearches');
                      setShowRecentSearches(false);
                    }}
                  >
                    Clear recent searches
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center section with logo - fixed position to match your screenshot */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex justify-center">
          <Link href="/">
            <Image
              src="/images/Detailed%20Logo.png"
              alt="Caskmark logo"
              width={scrolled ? 48 : 60}
              height={scrolled ? 48 : 60}
              className="transition-all duration-300"
              priority
            />
          </Link>
        </div>

        {/* Right navigation section */}
        <div className="hidden md:flex items-center space-x-4 text-sm font-medium">
          <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
          <Link href="/how-it-works" className="hover:text-amber-600 transition-colors">How It Works</Link>
          
          {/* Partners dropdown */}
          <div className="relative" ref={partnersRef}>
            <button 
              onClick={() => setPartnersDropdownOpen(!partnersDropdownOpen)} 
              onKeyDown={(e) => e.key === 'Enter' && setPartnersDropdownOpen(!partnersDropdownOpen)}
              tabIndex={0}
              className="flex items-center focus:outline-none hover:text-amber-600 transition-colors"
              aria-expanded={partnersDropdownOpen}
              aria-haspopup="true"
            >
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
          
          {/* Technology dropdown */}
          <div className="relative" ref={technologyRef}>
            <button 
              onClick={() => setTechnologyDropdownOpen(!technologyDropdownOpen)}
              onKeyDown={(e) => e.key === 'Enter' && setTechnologyDropdownOpen(!technologyDropdownOpen)}
              tabIndex={0}
              className="flex items-center focus:outline-none hover:text-amber-600 transition-colors"
              aria-expanded={technologyDropdownOpen}
              aria-haspopup="true"
            >
              Technology <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-300 ${technologyDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {technologyDropdownOpen && (
              <div className="absolute bg-white text-black shadow-md mt-2 py-2 rounded-md w-48 z-10">
                <Link href="/technology/registry-model" className="block px-4 py-2 hover:bg-gray-100">Registry Model</Link>
                <Link href="/technology/appraisal-system" className="block px-4 py-2 hover:bg-gray-100">Appraisal System</Link>
              </div>
            )}
          </div>
          
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1 text-xs">
                  {notificationCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-20 overflow-hidden">
                <div className="flex justify-between items-center border-b px-4 py-2">
                  <h3 className="font-medium">Notifications</h3>
                  <button 
                    onClick={markAllNotificationsAsRead} 
                    className="text-xs text-amber-600 hover:text-amber-700"
                  >
                    Mark all as read
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div>
                      {notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`px-4 py-3 border-b ${
                            !notification.read ? "bg-amber-50" : ""
                          } border-gray-100`}
                        >
                          <p className="text-sm">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-6 text-center text-gray-500">
                      <p>No notifications yet</p>
                    </div>
                  )}
                </div>
                <div className="px-4 py-2 border-t">
                  <Link href="/notifications" 
                    className="block text-center text-sm text-amber-600 hover:text-amber-700"
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* Dark mode toggle */}
          <button 
            onClick={toggleDarkMode} 
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
          
          {/* Language selector */}
          <div className="relative" ref={languageRef}>
            <select 
              value={currentLanguage}
              onChange={(e) => setCurrentLanguage(e.target.value)}
              className="appearance-none bg-transparent border-none px-2 py-1 pr-8 focus:outline-none text-sm"
              aria-label="Select language"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4" />
          </div>
          
          {/* User account or get started */}
          {user ? (
            <>
              {roleCTA()}
              <div className="relative" ref={accountRef}>
                <button 
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  onKeyDown={(e) => e.key === 'Enter' && setAccountDropdownOpen(!accountDropdownOpen)}
                  tabIndex={0}
                  className="flex items-center focus:outline-none hover:text-amber-600 transition-colors"
                  aria-expanded={accountDropdownOpen}
                  aria-haspopup="true"
                >
                  My Account <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-300 ${accountDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {accountDropdownOpen && (
                  <div className="absolute right-0 bg-white text-black shadow-md mt-2 py-2 rounded-md w-40 z-10">
                    <Link href="/myaccount" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                    <button 
                      onClick={handleLogout} 
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="relative" ref={getStartedRef}>
              <button 
                onClick={() => setGetStartedDropdownOpen(!getStartedDropdownOpen)}
                onKeyDown={(e) => e.key === 'Enter' && setGetStartedDropdownOpen(!getStartedDropdownOpen)}
                tabIndex={0}
                className="flex items-center bg-white text-black px-4 py-2 rounded hover:bg-gray-100 transition-colors"
                aria-expanded={getStartedDropdownOpen}
                aria-haspopup="true"
              >
                Get Started <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-300 ${getStartedDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {getStartedDropdownOpen && (
                <div className="absolute right-0 bg-white text-black shadow-md mt-2 py-2 rounded-md w-40 z-10">
                  <Link href="/login" className="block px-4 py-2 hover:bg-gray-100">Login</Link>
                  <Link href="/signup" className="block px-4 py-2 hover:bg-gray-100">Sign Up</Link>
                  <Link href="/get-access" className="block px-4 py-2 hover:bg-gray-100">Learn More</Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile menu toggle button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className="md:hidden"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-5 space-y-5 text-sm font-medium px-4 pb-5">
          {/* Mobile search form */}
          <div className="relative mb-4">
            <form onSubmit={handleSearch} className="relative">
              <input 
                type="text" 
                placeholder="Search CaskMark ID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="pl-8 pr-12 py-2 rounded-full text-sm border border-gray-300 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 w-full"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-amber-600 hover:bg-amber-700 text-white rounded-full w-7 h-7 flex items-center justify-center"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              
              {/* Mobile loading indicator */}
              {isSearching && (
                <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </form>
            
            {/* Mobile search error message */}
            {searchError && (
              <div className="mt-1 bg-red-100 text-red-600 text-xs p-1 rounded shadow-sm">
                {searchError}
              </div>
            )}
            
            {/* Mobile recent searches */}
            {recentSearches.length > 0 && (
              <div className="mt-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs text-gray-500 font-medium">Recent Searches</h4>
                  <button 
                    className="text-xs text-amber-600" 
                    onClick={() => {
                      setRecentSearches([]);
                      localStorage.removeItem('recentSearches');
                    }}
                  >
                    Clear
                  </button>
                </div>
                <div className="mt-1 rounded overflow-hidden bg-gray-50">
                  {recentSearches.slice(0, 3).map((search, index) => (
                    <button 
                      key={index} 
                      className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-200"
                      onClick={() => handleRecentSearchClick(search)}
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mobile navigation links */}
          <Link href="/" className="block py-1">Home</Link>
          <Link href="/how-it-works" className="block py-1">How It Works</Link>

          <details className="group">
            <summary className="cursor-pointer py-1 list-none flex items-center justify-between">
              Partners
              <ChevronDown className="w-4 h-4 transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <div className="ml-4 space-y-2 mt-2">
              <Link href="/partners/brokers" className="block py-1">Brokers</Link>
              <Link href="/partners/warehouses" className="block py-1">Warehouses</Link>
              <Link href="/partners/appraisers" className="block py-1">Appraisers/Insurers</Link>
            </div>
          </details>

          <details className="group">
            <summary className="cursor-pointer py-1 list-none flex items-center justify-between">
              Technology
              <ChevronDown className="w-4 h-4 transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <div className="ml-4 space-y-2 mt-2">
              <Link href="/technology/registry-model" className="block py-1">Registry Model</Link>
              <Link href="/technology/appraisal-system" className="block py-1">Appraisal System</Link>
            </div>
          </details>

          {/* Mobile settings section */}
          <div className="flex items-center justify-between py-2 border-gray-200 border-t border-b">
            <span>Dark Mode</span>
            <button 
              onClick={toggleDarkMode}
              className={`${
                darkMode 
                  ? "bg-amber-600" 
                  : "bg-gray-200"
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
            >
              <span
                className={`${
                  darkMode ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-2 border-gray-200 border-b">
            <span>Language</span>
            <select 
              value={currentLanguage}
              onChange={(e) => setCurrentLanguage(e.target.value)}
              className={`${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
              } border-none pr-8 py-1 rounded focus:outline-none`}
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>

          {/* Mobile user account or get started */}
          {user ? (
            <>
              {roleCTA() && <div className="block py-1">{roleCTA()}</div>}
              <details className={`group ${darkMode ? "text-white" : ""}`}>
                <summary className="cursor-pointer py-1 list-none flex items-center justify-between">
                  My Account
                  <ChevronDown className="w-4 h-4 transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <div className="ml-4 space-y-2 mt-2">
                  <Link href="/myaccount" className="block py-1">Profile</Link>
                  <Link href="/notifications" className="block py-1">
                    Notifications
                    {notificationCount > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                        {notificationCount}
                      </span>
                    )}
                  </Link>
                  <button onClick={handleLogout} className="block py-1 text-left">Logout</button>
                </div>
              </details>
            </>
          ) : (
            <>
              <details className={`group ${darkMode ? "text-white" : ""}`}>
                <summary className="cursor-pointer py-1 list-none flex items-center justify-between">
                  Get Started
                  <ChevronDown className="w-4 h-4 transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <div className="ml-4 space-y-2 mt-2">
                  <Link href="/login" className="block py-1">Login</Link>
                  <Link href="/signup" className="block py-1">Sign Up</Link>
                  <Link href="/get-access" className="block py-1">Learn More</Link>
                </div>
              </details>
            </>
          )}

          {/* Mobile footer */}
          <div className="pt-4 mt-4 border-t text-xs">
            <div className="flex justify-between">
              <Link href="/privacy" className="text-gray-500 hover:text-amber-600">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-500 hover:text-amber-600">Terms</Link>
              <Link href="/contact" className="text-gray-500 hover:text-amber-600">Contact</Link>
            </div>
            <p className="mt-2 text-center text-gray-500">© {new Date().getFullYear()} CaskMark</p>
          </div>
        </div>
      )}
    </nav>
  );
}