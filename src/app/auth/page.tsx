"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (email === 'mentor@gmail.com' && password === 'mentor123') {
      router.push('/mentor');
    } else if (email === 'teacher@gmail.com' && password === 'teacher123') {
      router.push('/teacher');
    } else if (email === 'parent@gmail.com' && password === 'parent123') {
      router.push('/parent');
    } else {
      setError('Email atau password salah');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">E-Report</h1>
          {/* <p className="mt-2 text-sm text-gray-600">Please sign in to your account</p> */}
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="flex w-full justify-center rounded-md border border-transparent bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 transition-colors"
          >
            Sign in
          </button>
        </form>
        
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Dummy Accounts:</h3>
          <div className="space-y-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-md">
            <div className="flex justify-between">
              <span className="font-semibold text-brand-600">Mentor:</span>
              <span>mentor@gmail.com / mentor123</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-brand-600">Teacher:</span>
              <span>teacher@gmail.com / teacher123</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-brand-600">Parent:</span>
              <span>parent@gmail.com / parent123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}