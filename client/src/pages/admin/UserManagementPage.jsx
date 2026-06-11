import { useEffect, useState } from 'react';
import axios from 'axios';

const token = () => JSON.parse(localStorage.getItem('admin') || 'null')?.token;

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const load = async () => {
    const { data } = await axios.get('/api/admin/users', { headers: { Authorization: `Bearer ${token()}` } });
    setUsers(data);
  };

  useEffect(() => { load(); }, []);

  const createUser = async (e) => {
    e.preventDefault();
    await axios.post('/api/admin/users', { userId: Number(userId), name }, { headers: { Authorization: `Bearer ${token()}` } });
    setMessage('User created');
    setUserId('');
    setName('');
    load();
  };

  return <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl"> <h1 className="text-3xl font-black">User Management</h1><p className="mt-2 text-slate-300">Create user IDs and manage player access.</p><form onSubmit={createUser} className="mt-6 grid gap-4 md:grid-cols-2"><input value={userId} onChange={(e)=>setUserId(e.target.value)} className="rounded-2xl border border-white/10 bg-slate-800 px-4 py-3" placeholder="Numeric ID" /><input value={name} onChange={(e)=>setName(e.target.value)} className="rounded-2xl border border-white/10 bg-slate-800 px-4 py-3" placeholder="Player name" /><button className="rounded-2xl bg-emerald-400 px-4 py-3 font-semibold text-slate-950 md:col-span-2">Create user</button></form>{message && <p className="mt-4 text-sm text-emerald-200">{message}</p>}<div className="mt-6 space-y-3">{users.map((user) => <div key={user._id} className="rounded-2xl border border-white/10 bg-slate-800/80 p-4"><p className="font-semibold">{user.name}</p><p className="text-sm text-slate-300">ID: {user.userId} • Points: {user.totalPoints}</p></div>)}</div></section>;
}
