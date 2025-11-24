import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AuthLayout } from '../components/Layout/AuthLayout';
import { Button } from '../components/UI/Button';
import { resetPassword } from '../services/authApi';

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await resetPassword({ token: token || '', newPassword: password });
      setMessage('Password updated. Redirecting to login...');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err: any) {
      setError(err.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset password" subtitle="Choose a new password to secure your account.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-midnight">New password</label>
          <input
            className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-midnight shadow-inner focus:border-blue-400 focus:outline-none"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-midnight">Confirm password</label>
          <input
            className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-midnight shadow-inner focus:border-blue-400 focus:outline-none"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-sm text-rose-500">{error}</p>}
        {message && <p className="text-sm text-blue-600">{message}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Updating...' : 'Reset password'}
        </Button>
        <div className="text-sm">
          <Link to="/login" className="font-semibold text-blue-600 hover:underline">
            Back to login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
