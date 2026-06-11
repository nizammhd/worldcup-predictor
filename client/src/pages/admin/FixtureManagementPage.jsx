import { useEffect, useState } from 'react';
import axios from 'axios';

const token = () => JSON.parse(localStorage.getItem('admin') || 'null')?.token;

export default function FixtureManagementPage() {
  const [matches, setMatches] = useState([]);
  const [form, setForm] = useState({ team1: '', team2: '', matchDate: '' });

  const load = async () => {
    const { data } = await axios.get('/api/admin/matches', { headers: { Authorization: `Bearer ${token()}` } });
    setMatches(data);
  };

  useEffect(() => { load(); }, []);

  const createMatch = async (e) => {
    e.preventDefault();
    await axios.post('/api/admin/matches', form, { headers: { Authorization: `Bearer ${token()}` } });
    setForm({ team1: '', team2: '', matchDate: '' });
    load();
  };

  return <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl"> <h1 className="text-3xl font-black">Fixture Management</h1><p className="mt-2 text-slate-300">Create and review fixtures for predictions.</p><form onSubmit={createMatch} className="mt-6 grid gap-4 md:grid-cols-2"><input value={form.team1} onChange={(e)=>setForm({ ...form, team1: e.target.value })} className="rounded-2xl border border-white/10 bg-slate-800 px-4 py-3" placeholder="Team 1" /><input value={form.team2} onChange={(e)=>setForm({ ...form, team2: e.target.value })} className="rounded-2xl border border-white/10 bg-slate-800 px-4 py-3" placeholder="Team 2" /><input type="datetime-local" value={form.matchDate} onChange={(e)=>setForm({ ...form, matchDate: e.target.value })} className="rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 md:col-span-2" /><button className="rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 md:col-span-2">Add fixture</button></form><div className="mt-6 space-y-3">{matches.map((match) => <div key={match._id} className="rounded-2xl border border-white/10 bg-slate-800/80 p-4"><p className="font-semibold">{match.team1} vs {match.team2}</p><p className="text-sm text-slate-300">{new Date(match.matchDate).toLocaleString()}</p></div>)}</div></section>;
}
