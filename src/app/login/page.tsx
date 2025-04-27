'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'magic' | 'reset'>('login');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
      else router.push('/dashboard');
    }

    if (mode === 'magic') {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) setMessage(error.message);
      else setMessage('Magic link sent! Check your inbox.');
    }

    if (mode === 'reset') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) setMessage(error.message);
      else setMessage('Password reset email sent!');
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <main className="bg-white text-black pt-28 px-6 pb-20 max-w-xl mx-auto">
        <h1 className="text-4xl font-serif font-bold mb-10 text-center">Log In</h1>

        <div className="flex justify-center gap-4 mb-6 text-sm">
          <button
            onClick={() => setMode('login')}
            className={mode === 'login' ? 'underline font-bold' : ''}
          >
            Email + Password
          </button>
          <button
            onClick={() => setMode('magic')}
            className={mode === 'magic' ? 'underline font-bold' : ''}
          >
            Magic Link
          </button>
          <button
            onClick={() => setMode('reset')}
            className={mode === 'reset' ? 'underline font-bold' : ''}
          >
            Reset Password
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />

          {mode === 'login' && (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          )}

          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#2f1b0c] text-white py-2 px-6 rounded hover:bg-[#442c1c] transition-all hover:scale-105"
            >
              {loading
                ? mode === 'login'
                  ? 'Logging in...'
                  : mode === 'magic'
                  ? 'Sending magic link...'
                  : 'Sending reset...'
                : mode === 'login'
                ? 'Log In'
                : mode === 'magic'
                ? 'Send Magic Link'
                : 'Send Reset Link'}
            </button>
          </div>

          {message && <p className="text-center text-sm text-red-500">{message}</p>}
        </form>
      </main>
      <Footer />
    </>
  );
}
