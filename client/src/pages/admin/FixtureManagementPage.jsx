import { useEffect, useState } from 'react';
import axios from 'axios';

const token = () => JSON.parse(localStorage.getItem('admin') || 'null')?.token;

export default function FixtureManagementPage() {
  const [matches, setMatches] = useState([]);
  const [form, setForm] = useState({ team1: '', team2: '', matchDate: '' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ team1: '', team2: '', matchDate: '' });

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

  const startEdit = (match) => {
    setEditingId(match._id);
    setEditForm({
      team1: match.team1,
      team2: match.team2,
      matchDate: match.matchDate ? new Date(match.matchDate).toISOString().slice(0, 16) : '',
    });
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    await axios.put(`/api/admin/matches/${editingId}`, editForm, { headers: { Authorization: `Bearer ${token()}` } });
    setEditingId(null);
    load();
  };

  const deleteMatch = async (id) => {
    if (!window.confirm('Delete this fixture?')) return;
    await axios.delete(`/api/admin/matches/${id}`, { headers: { Authorization: `Bearer ${token()}` } });
    load();
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl">
      <h1 className="text-3xl font-black">Fixture Management</h1>
      <p className="mt-2 text-slate-300">Create, edit, and remove fixtures for predictions.</p>

      <form onSubmit={createMatch} className="mt-6 grid gap-4 md:grid-cols-2">
        <input value={form.team1} onChange={(e) => setForm({ ...form, team1: e.target.value })} className="rounded-2xl border border-white/10 bg-slate-800 px-4 py-3" placeholder="Team 1" />
        <input value={form.team2} onChange={(e) => setForm({ ...form, team2: e.target.value })} className="rounded-2xl border border-white/10 bg-slate-800 px-4 py-3" placeholder="Team 2" />
        <input type="datetime-local" value={form.matchDate} onChange={(e) => setForm({ ...form, matchDate: e.target.value })} className="rounded-2xl border border-white/10 bg-slate-800 px-4 py-3 md:col-span-2" />
        <button className="rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 md:col-span-2">Add fixture</button>
      </form>

      <div className="mt-6 space-y-3">
        {matches.map((match) => (
          <div key={match._id} className="rounded-2xl border border-white/10 bg-slate-800/80 p-4">
            {editingId === match._id ? (
              <form onSubmit={saveEdit} className="grid gap-3">
                <input value={editForm.team1} onChange={(e) => setEditForm({ ...editForm, team1: e.target.value })} className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3" placeholder="Team 1" />
                <input value={editForm.team2} onChange={(e) => setEditForm({ ...editForm, team2: e.target.value })} className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3" placeholder="Team 2" />
                <input type="datetime-local" value={editForm.matchDate} onChange={(e) => setEditForm({ ...editForm, matchDate: e.target.value })} className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3" />
                <div className="flex gap-3">
                  <button type="submit" className="rounded-2xl bg-emerald-400 px-4 py-2 font-semibold text-slate-950">Save</button>
                  <button type="button" onClick={() => setEditingId(null)} className="rounded-2xl bg-slate-700 px-4 py-2 font-semibold text-slate-100">Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{match.team1} vs {match.team2}</p>
                    <p className="text-sm text-slate-300">{new Date(match.matchDate).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(match)} className="rounded-2xl bg-amber-400 px-3 py-2 text-sm font-semibold text-slate-950">Edit</button>
                    <button onClick={() => deleteMatch(match._id)} className="rounded-2xl bg-rose-400 px-3 py-2 text-sm font-semibold text-slate-950">Delete</button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
