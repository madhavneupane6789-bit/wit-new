import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';

const features = [
  { title: 'Curated Library', description: 'Organized video lectures and PDFs with a clean, nested tree view.' },
  { title: 'Admin Control', description: 'Manage folders, files, and structure with instant updates.' },
  { title: 'Secure Access', description: 'JWT authentication with refresh rotation and protected dashboards.' },
];

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-indigo-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 md:flex-row md:items-center">
        <div className="flex-1 space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Education Hub</p>
            <h1 className="mt-4 text-5xl font-extrabold leading-tight text-midnight">
              Learn with clarity. Manage with elegance.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-slate-600">
              A modern platform inspired by Apple’s calm precision. Streamlined access for learners and a powerful admin
              workspace for curators.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link to="/login">
                <Button>Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="ghost">Create account</Button>
              </Link>
            </div>
          </motion.div>
          <div className="grid gap-4 md:grid-cols-3">
            {features.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
              >
                <Card className="h-full bg-white/70">
                  <h3 className="text-lg font-semibold text-midnight">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="glass relative rounded-3xl border border-white/60 p-6 shadow-2xl">
            <div className="absolute inset-x-6 top-6 h-32 rounded-2xl bg-gradient-to-r from-blue-500/60 via-cyan-400/50 to-emerald-400/50 blur-3xl" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-white/80">Library Preview</p>
                  <h3 className="text-2xl font-semibold text-white">Liquid Explorer</h3>
                </div>
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">Live</span>
              </div>
              <div className="space-y-3 rounded-2xl bg-white/30 p-4 text-sm text-white backdrop-blur-lg">
                <div className="flex items-center justify-between rounded-xl bg-white/10 p-3">
                  <span>Physics / Quantum</span>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs">Video</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-white/10 p-3">
                  <span>Calculus Notes</span>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs">PDF</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-white/10 p-3">
                  <span>World History / Renaissance</span>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs">Video</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
