import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../components/Layout/AuthLayout';
import { Button } from '../components/UI/Button';
import { forgotPassword } from '../services/authApi';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await forgotPassword(email);
      setMessage(res.message || 'If an account exists, a link was created.');
    } catch (err: any) {
      setMessage(err.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email and we will generate a reset link (check server logs in this demo)."
    >
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
        {message && <p className="text-sm text-blue-600">{message}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Sending...' : 'Send reset link'}
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

export default ForgotPasswordPage;
