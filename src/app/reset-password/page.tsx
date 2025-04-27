'use client';

import { Suspense } from 'react';
import ResetPasswordForm from './ResetPasswordForm';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import React from 'react';

export default function ResetPasswordPageWrapper() {
  return (
    <>
      <Navbar />
      <main className="bg-white text-black pt-28 px-6 pb-20 max-w-md mx-auto">
        <Suspense fallback={<div>Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
