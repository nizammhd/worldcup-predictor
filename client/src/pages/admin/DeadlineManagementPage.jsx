import { useEffect, useState } from 'react';
import axios from 'axios';

const token = () => JSON.parse(localStorage.getItem('admin') || 'null')?.token;

export default function DeadlineManagementPage() {
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    axios.get('/api/admin/settings', { headers: { Authorization: `Bearer ${token()}` } }).then(({ data }) => setDeadline(data.predictionDeadline ? data.predictionDeadline.slice(0, 16) : ''));
  }, []);

  const save = async (e) => {
    e.preventDefault();
    await axios.put('/api/admin/settings', { predictionDeadline: new Date(deadline).toISOString() }, { headers: { Authorization: `Bearer ${token()}` } });
    alert('Deadline updated');
  };

  return <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl"> <h1 className="text-3xl font-black">Deadline Management</h1><p className="mt-2 text-slate-300">Set or update the prediction cutoff time.</p><form onSubmit={save} className="mt-6 space-y-4"><input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-800 px-4 py-3" /><button className="w-full rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950">Save Deadline</button></form></section>;
}
