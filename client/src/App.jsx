import { Routes, Route, Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

import UserLoginPage from './pages/user/LoginPage';
import UserDashboardPage from './pages/user/DashboardPage';
import PredictionPage from './pages/user/PredictionPage';
import MyPredictionsPage from './pages/user/MyPredictionsPage';
import LeaderboardPage from './pages/user/LeaderboardPage';

import AdminLoginPage from './pages/admin/LoginPage';
import AdminDashboardPage from './pages/admin/DashboardPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import FixtureManagementPage from './pages/admin/FixtureManagementPage';
import DeadlineManagementPage from './pages/admin/DeadlineManagementPage';
import ResultManagementPage from './pages/admin/ResultManagementPage';

const api = axios.create({ baseURL: '/api' });

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [admin, setAdmin] = useState(() => JSON.parse(localStorage.getItem('admin') || 'null'));
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    if (admin?.token) api.defaults.headers.common.Authorization = `Bearer ${admin.token}`;
  }, [admin]);

  useEffect(() => {
    axios.get('/api/leaderboard').then(({ data }) => setLeaderboard(data)).catch(() => setLeaderboard([]));
  }, []);

  return (
    <div className="min-h-screen text-slate-100">
      <header className="border-b border-white/10 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-3 text-xl font-black tracking-wide text-emerald-300">
            <img src="/logo.png" alt="World Cup Predictor logo" className="h-8 w-8 rounded-full object-contain bg-white/90 p-1 shadow-sm md:h-9 md:w-9" />
            <span>World Cup Predictor</span>
          </Link>
          <nav className="flex items-center gap-3 text-sm text-slate-200">
            {!user && !admin && <>
              <Link to="/login" className="rounded-full border border-emerald-400/40 px-3 py-2">Enter ID</Link>
              <Link to="/admin/login" className="rounded-full border border-cyan-400/40 px-3 py-2" title="Admin panel">⚙️</Link>
            </>}
            {user && <Link to="/dashboard" className="rounded-full border border-emerald-400/40 px-3 py-2">Dashboard</Link>}
            {admin && <button onClick={() => { localStorage.removeItem('admin'); setAdmin(null); }} className="rounded-full border border-rose-400/40 px-3 py-2">Logout Admin</button>}
            {user && <button onClick={() => { localStorage.removeItem('user'); setUser(null); }} className="rounded-full border border-rose-400/40 px-3 py-2">Logout User</button>}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage leaderboard={leaderboard} />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <UserLoginPage setUser={setUser} />} />
          <Route path="/dashboard" element={user ? <UserDashboardPage user={user} /> : <Navigate to="/login" />} />
          <Route path="/predict" element={user ? <PredictionPage user={user} /> : <Navigate to="/login" />} />
          <Route path="/my-predictions" element={user ? <MyPredictionsPage user={user} /> : <Navigate to="/login" />} />
          <Route path="/leaderboard" element={user ? <LeaderboardPage user={user} /> : <Navigate to="/login" />} />

          <Route path="/admin/login" element={admin ? <Navigate to="/admin/dashboard" /> : <AdminLoginPage setAdmin={setAdmin} />} />
          <Route path="/admin/dashboard" element={admin ? <AdminDashboardPage /> : <Navigate to="/admin/login" />} />
          <Route path="/admin/users" element={admin ? <UserManagementPage /> : <Navigate to="/admin/login" />} />
          <Route path="/admin/fixtures" element={admin ? <FixtureManagementPage /> : <Navigate to="/admin/login" />} />
          <Route path="/admin/deadline" element={admin ? <DeadlineManagementPage /> : <Navigate to="/admin/login" />} />
          <Route path="/admin/results" element={admin ? <ResultManagementPage /> : <Navigate to="/admin/login" />} />
        </Routes>
      </main>
    </div>
  );
}

function HomePage({ leaderboard }) {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl md:p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(52,211,153,0.12),transparent_30%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.12),transparent_25%)]" />
      <div className="relative grid items-center gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6 text-center md:text-left">
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">World Cup Prediction</p>
          <h1 className="text-4xl font-black text-white md:text-5xl">Admin manages the users and IDs</h1>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 text-slate-100 shadow-xl shadow-black/20 backdrop-blur">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">Top 5</p>
              <h2 className="text-xl font-black text-white">Leaderboard</h2>
            </div>
            <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">Live</span>
          </div>
          <ul className="mt-4 space-y-3 text-sm text-slate-200">
            {leaderboard.length === 0 ? (
              <li className="rounded-2xl border border-white/8 bg-white/5 px-3 py-2 text-slate-300">No leaderboard data yet.</li>
            ) : leaderboard.slice(0, 5).map((entry, index) => (
              <li key={entry._id || `${entry.userId}-${index}`} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-3 py-2">
                <span className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400/10 text-xs font-black text-emerald-200">#{index + 1}</span>
                  <span className="font-semibold text-white">{entry.name || `User ${entry.userId}`}</span>
                </span>
                <span className="text-emerald-200">{entry.totalPoints ?? 0} pts</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default App;
