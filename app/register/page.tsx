'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      router.push('/login');
    } else {
      const data = await res.json();
      setError(data.message || 'Something went wrong');
    }
  };

  return (
    <main className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-4">Create an Account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Full Name"
          required
          className="w-full p-2 border"
        />
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full p-2 border"
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full p-2 border"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2">
          Register
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </main>
  );
}
