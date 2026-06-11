import { Link } from 'react-router-dom';

export default function DashboardPage() {
  return <section className="space-y-6"> <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl"><p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Admin Panel</p><h1 className="mt-2 text-3xl font-black">Control users, fixtures, results, and deadlines.</h1></div><div className="grid gap-6 md:grid-cols-2">{[
    ['User Management', '/admin/users'],
    ['Fixture Management', '/admin/fixtures'],
    ['Deadline Management', '/admin/deadline'],
    ['Result Management', '/admin/results']
  ].map(([label, to]) => <Link key={label} to={to} className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 hover:border-cyan-400/40"> <h2 className="text-xl font-bold">{label}</h2><p className="mt-2 text-slate-300">Manage the core prediction workflow from one place.</p></Link>)}</div></section>;
}
