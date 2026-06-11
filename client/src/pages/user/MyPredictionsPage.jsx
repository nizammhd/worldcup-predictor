import { useEffect, useState } from 'react';
import axios from 'axios';

export default function MyPredictionsPage({ user }) {
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    axios.get(`/api/predictions/me/${user.userId}`).then(({ data }) => setPredictions(data));
  }, [user.userId]);

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl">
      <h1 className="text-3xl font-black">My Predictions</h1>
      <p className="mt-2 text-slate-300">Review your submitted picks and point totals.</p>
      <div className="mt-6 space-y-4">{predictions.map((item) => <div key={item._id} className="rounded-2xl border border-white/10 bg-slate-800/80 p-4"><p className="font-semibold">{item.matchId?.team1} vs {item.matchId?.team2}</p><p className="mt-1 text-slate-300">Prediction: {item.predicted1} - {item.predicted2} • Points: {item.pointsAwarded}</p></div>)}</div>
    </section>
  );
}
