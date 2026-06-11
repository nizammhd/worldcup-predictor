import { useState } from 'react';
import axios from 'axios';

export default function LoginPage({ setUser }) {
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');

  const login = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/users/login', { userId });
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      setMessage('Login successful');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to login');
    }
  };

  return (
    <section className="mx-auto max-w-md rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl">
      <h1 className="text-3xl font-black">User Login</h1>
      <p className="mt-2 text-slate-300">Enter your unique numeric ID to access your dashboard.</p>
      <form onSubmit={login} className="mt-6 space-y-4">
        <input value={userId} onChange={(e) => setUserId(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3" placeholder="Enter user ID" />
        <button className="w-full rounded-2xl bg-emerald-400 px-4 py-3 font-semibold text-slate-950">Login</button>
      </form>
      {message && <p className="mt-4 text-sm text-emerald-200">{message}</p>}
    </section>
  );
}
