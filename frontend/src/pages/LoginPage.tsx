import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/Layout/AuthLayout';
import { Button } from '../components/UI/Button';
import { useAuth } from '../hooks/useAuth';

const LoginPage: React.FC = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const user = await login(email, password);
      navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Access your learning hub with one click.">
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <div className="flex items-center justify-between text-sm">
          <Link to="/forgot-password" className="font-semibold text-blue-600 hover:underline">
            Forgot your password?
          </Link>
          <Link to="/register" className="text-slate-500 hover:text-slate-700">
            Create account
          </Link>
        </div>
        {error && <p className="text-sm text-rose-500">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
