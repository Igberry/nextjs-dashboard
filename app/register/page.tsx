'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AcmeLogo from '@/app/ui/acme-logo';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        router.push('/login');
      } else {
        try {
          const data = await res.json();
          setError(data.message || 'Something went wrong');
        } catch {
          setError('An error occurred during registration. Please try again.');
        }
      }
    } catch (err) {
      setError('Failed to connect to server. Please check your connection and try again.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
        <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
          <h1 className="mb-3 text-2xl font-bold">Create an Account</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-900" htmlFor="name">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="w-full rounded-md border border-gray-200 px-4 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-900" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full rounded-md border border-gray-200 px-4 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-900" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter a password (min 6 characters)"
                required
                minLength={6}
                className="w-full rounded-md border border-gray-200 px-4 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-blue-600 py-2 text-white font-semibold hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
            {error && (
              <div className="rounded-md bg-red-50 p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold text-blue-600 hover:text-blue-700 underline"
              >
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
