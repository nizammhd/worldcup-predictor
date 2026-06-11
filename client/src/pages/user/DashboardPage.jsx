import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function DashboardPage({ user }) {
  const [matches, setMatches] = useState([]);
  const [deadline, setDeadline] = useState(null);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    axios.get('/api/matches').then(({ data }) => {
      setMatches(data.matches || []);
      setDeadline(data.deadline);
      setIsClosed(Boolean(data.isClosed));
    });
  }, []);

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl">
        <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">Welcome</p>
        <h1 className="mt-2 text-3xl font-black">{user.name}</h1>
        <p className="mt-3 text-slate-300">Your ID: {user.userId} • Total points: {user.totalPoints}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {!isClosed ? (
          <Link to="/predict" className="rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-6"><h2 className="text-xl font-bold">Submit predictions</h2><p className="mt-2 text-slate-300">Predict scores for all active fixtures before the deadline.</p></Link>
        ) : (
          <div className="rounded-3xl border border-amber-400/30 bg-amber-400/10 p-6"><h2 className="text-xl font-bold">Prediction window closed</h2><p className="mt-2 text-slate-300">You can still view your submitted picks in My predictions.</p></div>
        )}
        <Link to="/my-predictions" className="rounded-3xl border border-cyan-400/30 bg-cyan-400/10 p-6"><h2 className="text-xl font-bold">My predictions</h2><p className="mt-2 text-slate-300">Review all your submitted picks and awarded points.</p></Link>
        <Link to="/leaderboard" className="rounded-3xl border border-fuchsia-400/30 bg-fuchsia-400/10 p-6"><h2 className="text-xl font-bold">Leaderboard</h2><p className="mt-2 text-slate-300">See how your score compares with other users.</p></Link>
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6"><h2 className="text-xl font-bold">Deadline</h2><p className="mt-2 text-slate-300">{deadline ? new Date(deadline).toLocaleString() : 'Not set yet'}</p></div>
      </div>
      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl">
        <h2 className="text-xl font-bold">Upcoming matches</h2>
        <ul className="mt-4 space-y-3">{matches.slice(0, 6).map((match) => <li key={match._id} className="rounded-2xl border border-white/10 bg-slate-800/80 p-4">{match.team1} vs {match.team2} • {new Date(match.matchDate).toLocaleString()}</li>)}</ul>
      </div>
    </section>
  );
}
