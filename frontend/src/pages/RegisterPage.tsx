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
  
  const inputStyles = "glass w-full rounded-xl border-transparent bg-black/20 px-3 py-2 text-white shadow-inner focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary";
  const labelStyles = "text-sm font-semibold text-slate-300";

  return (
    <AuthLayout title="Create your account" subtitle="Stay in sync with your study materials.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className={labelStyles}>Name</label>
              <input className={inputStyles} value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className={labelStyles}>Email</label>
              <input className={inputStyles} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className={labelStyles}>Password</label>
              <input className={inputStyles} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className={labelStyles}>Confirm Password</label>
              <input className={inputStyles} type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label className={labelStyles}>Phone (optional)</label>
              <input className={inputStyles} value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className={labelStyles}>School/College (optional)</label>
              <input className={inputStyles} value={school} onChange={(e) => setSchool(e.target.value)} />
            </div>
        </div>
        <div className="space-y-2">
            <label className={labelStyles}>Preparing for (optional)</label>
            <input className={inputStyles} value={prep} onChange={(e) => setPrep(e.target.value)} />
        </div>
        <div className="space-y-2">
            <label className={labelStyles}>Avatar URL (optional)</label>
            <input className={inputStyles} value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://..." />
        </div>
        
        <div className="pt-2 text-sm">
          <span className="text-slate-400">Already have an account?</span>{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
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
