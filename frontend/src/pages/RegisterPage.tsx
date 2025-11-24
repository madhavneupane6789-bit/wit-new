import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/Layout/AuthLayout';
import { Button } from '../components/UI/Button';
import { useAuth } from '../hooks/useAuth';

const RegisterPage: React.FC = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [phone, setPhone] = useState('');
  const [school, setSchool] = useState('');
  const [prep, setPrep] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    try {
      const user = await register(name, email, password, phone || undefined, school || undefined, prep || undefined, avatarUrl || undefined);
      navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Stay in sync with your study materials.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-midnight">Name</label>
          <input
            className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-midnight shadow-inner focus:border-blue-400 focus:outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-midnight">Email</label>
          <input
            className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-midnight shadow-inner focus:border-blue-400 focus:outline-none"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-midnight">Password</label>
          <input
            className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-midnight shadow-inner focus:border-blue-400 focus:outline-none"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-midnight">Phone (optional)</label>
          <input
            className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-midnight shadow-inner focus:border-blue-400 focus:outline-none"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-midnight">School/College (optional)</label>
          <input
            className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-midnight shadow-inner focus:border-blue-400 focus:outline-none"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-midnight">Preparing for (optional)</label>
          <input
            className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-midnight shadow-inner focus:border-blue-400 focus:outline-none"
            value={prep}
            onChange={(e) => setPrep(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-midnight">Avatar URL (optional)</label>
          <input
            className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-midnight shadow-inner focus:border-blue-400 focus:outline-none"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-midnight">Confirm Password</label>
          <input
            className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-midnight shadow-inner focus:border-blue-400 focus:outline-none"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>
        <div className="text-sm">
          <span className="text-slate-500">Already have an account?</span>{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:underline">
            Login
          </Link>
        </div>
        {error && <p className="text-sm text-rose-500">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
