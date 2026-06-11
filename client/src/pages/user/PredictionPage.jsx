import { useEffect, useState } from 'react';
import axios from 'axios';

export default function PredictionPage({ user }) {
  const [matches, setMatches] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [message, setMessage] = useState('');
  const [readonly, setReadonly] = useState(false);

  useEffect(() => {
    axios.get('/api/matches').then(({ data }) => {
      setMatches(data.matches || []);
      setReadonly(Boolean(data.isClosed));
    });

    axios.get(`/api/predictions/me/${user.userId}`).then(({ data }) => {
      const existing = {};
      (data || []).forEach((item) => {
        existing[item.matchId._id || item.matchId] = {
          predicted1: item.predicted1,
          predicted2: item.predicted2,
        };
      });
      setPredictions(existing);
    }).catch(() => {});
  }, [user.userId]);

  const handleChange = (matchId, field, value) => {
    setPredictions(prev => ({ ...prev, [matchId]: { ...(prev[matchId] || {}), [field]: value } }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const payload = matches.map((match) => ({ matchId: match._id, predicted1: Number(predictions[match._id]?.predicted1 || 0), predicted2: Number(predictions[match._id]?.predicted2 || 0) }));
    try {
      const { data } = await axios.post('/api/predictions', { userId: user.userId, predictions: payload });
      setMessage(data.message || 'Predictions saved');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to save predictions');
    }
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl">
      <h1 className="text-3xl font-black">Prediction Page</h1>
      <p className="mt-2 text-slate-300">Edit your score predictions anytime before the deadline.</p>
      {readonly && <p className="mt-3 rounded-2xl bg-amber-400/10 p-3 text-amber-100">The prediction window is closed. You can still view your saved picks in My Predictions.</p>}
      <form onSubmit={submit} className="mt-6 space-y-4">
        {matches.map((match) => (
          <div key={match._id} className="rounded-2xl border border-white/10 bg-slate-800/80 p-4">
            <p className="font-semibold">{match.team1} vs {match.team2}</p>
            <div className="mt-3 flex gap-3">
              <input disabled={readonly} type="number" min="0" value={predictions[match._id]?.predicted1 || ''} onChange={(e) => handleChange(match._id, 'predicted1', e.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-700 px-3 py-2" placeholder={`${match.team1} goals`} />
              <input disabled={readonly} type="number" min="0" value={predictions[match._id]?.predicted2 || ''} onChange={(e) => handleChange(match._id, 'predicted2', e.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-700 px-3 py-2" placeholder={`${match.team2} goals`} />
            </div>
          </div>
        ))}
        <button disabled={readonly} className="w-full rounded-2xl bg-emerald-400 px-4 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50">Save Predictions</button>
      </form>
      {message && <p className="mt-4 text-sm text-emerald-200">{message}</p>}
    </section>
  );
}
