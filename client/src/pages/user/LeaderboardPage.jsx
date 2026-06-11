import { useEffect, useState } from 'react';
import axios from 'axios';

export default function LeaderboardPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('/api/leaderboard').then(({ data }) => setUsers(data));
  }, []);

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl">
      <h1 className="text-3xl font-black">Leaderboard</h1>
      <p className="mt-2 text-slate-300">Live standings based on exact score predictions.</p>
      <div className="mt-6 space-y-3">{users.map((user, index) => <div key={user._id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-800/80 p-4"><div><p className="font-semibold">#{index + 1} {user.name}</p><p className="text-sm text-slate-300">User ID: {user.userId}</p></div><span className="rounded-full bg-emerald-400/10 px-3 py-1 text-emerald-200">{user.totalPoints} pts</span></div>)}</div>
    </section>
  );
}
