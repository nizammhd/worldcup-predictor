import { useState } from 'react';
import axios from 'axios';

export default function LoginPage({ setAdmin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const login = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/admin/login', { username, password });
      localStorage.setItem('admin', JSON.stringify(data));
      setAdmin(data);
      setMessage('Admin login successful');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Admin login failed');
    }
  };

  return (
    <section className="mx-auto max-w-md rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl">
      <h1 className="text-3xl font-black">Admin Login</h1>
      <p className="mt-2 text-slate-300">Use admin credentials to manage users, matches, and results.</p>
      <form onSubmit={login} className="mt-6 space-y-4">
        <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3" placeholder="Username" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3" placeholder="Password" />
        <button className="w-full rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950">Login</button>
      </form>
      {message && <p className="mt-4 text-sm text-cyan-200">{message}</p>}
    </section>
  );
}
