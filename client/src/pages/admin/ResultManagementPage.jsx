import { useEffect, useState } from 'react';
import axios from 'axios';

const token = () => JSON.parse(localStorage.getItem('admin') || 'null')?.token;

export default function ResultManagementPage() {
  const [matches, setMatches] = useState([]);

  const load = async () => {
    const { data } = await axios.get('/api/admin/matches', { headers: { Authorization: `Bearer ${token()}` } });
    setMatches(data);
  };

  useEffect(() => { load(); }, []);

  const updateResult = async (match) => {
    const result1 = Number(prompt(`Enter ${match.team1} goals`, match.result1 ?? '0'));
    const result2 = Number(prompt(`Enter ${match.team2} goals`, match.result2 ?? '0'));
    await axios.put(`/api/admin/results/${match._id}`, { result1, result2 }, { headers: { Authorization: `Bearer ${token()}` } });
    load();
    alert('Results saved and points recalculated');
  };

  return <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl"> <h1 className="text-3xl font-black">Result Management</h1><p className="mt-2 text-slate-300">Enter final scores to calculate points automatically.</p><div className="mt-6 space-y-3">{matches.map((match) => <div key={match._id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-800/80 p-4"><div><p className="font-semibold">{match.team1} vs {match.team2}</p><p className="text-sm text-slate-300">Current result: {match.result1 ?? '?'} - {match.result2 ?? '?'}</p></div><button onClick={() => updateResult(match)} className="rounded-2xl bg-cyan-400 px-4 py-2 font-semibold text-slate-950">Update result</button></div>)}</div></section>;
}
