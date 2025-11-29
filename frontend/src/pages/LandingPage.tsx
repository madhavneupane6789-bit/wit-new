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
    <div className="relative min-h-screen text-white z-0">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-gradient-to-tl from-primary/30 to-secondary/30 blur-3xl" />
      </div>
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center gap-16 px-6 py-16 md:flex-row">
        <div className="flex-1 space-y-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-secondary">Education Hub</p>
            <h1 className="mt-4 text-5xl font-extrabold leading-tight text-white">
              Structured learning. Effortless control.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-slate-300">
              Browse a nested content library of videos, PDFs, and syllabus links. Learners get fast, organized access; admins curate and
              reorder with instant updates.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link to="/login">
                <Button>Get Started</Button>
              </Link>
              <Link to="/register">
                <Button variant="ghost">Create account</Button>
              </Link>
              <Link to="/mcq-ai">
                <Button variant="ghost">Try AI MCQ</Button>
              </Link>
            </div>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
              >
                <Card className="h-full">
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{item.description}</p>
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
          <div className="glass relative rounded-3xl p-6">
            <div className="absolute inset-x-6 top-6 h-32 rounded-2xl bg-gradient-to-r from-primary/60 via-secondary/50 to-primary/50 blur-3xl" />
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-300">Library Preview</p>
                  <h3 className="text-2xl font-semibold text-white drop-shadow">Liquid Explorer</h3>
                </div>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white shadow-sm">Live</span>
              </div>
              <div className="space-y-3 rounded-2xl bg-black/20 p-4 text-sm text-slate-300 backdrop-blur-lg">
                <motion.div whileHover={{ scale: 1.02 }} className="flex items-center justify-between rounded-xl bg-black/20 px-3 py-3 shadow-sm">
                  <span className="font-semibold text-white">Power Systems / Load Flow</span>
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">Video</span>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} className="flex items-center justify-between rounded-xl bg-black/20 px-3 py-3 shadow-sm">
                  <span className="font-semibold text-white">Control & Instrumentation Notes</span>
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">PDF</span>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} className="flex items-center justify-between rounded-xl bg-black/20 px-3 py-3 shadow-sm">
                  <span className="font-semibold text-white">NEA Level 7 Syllabus</span>
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">Linked</span>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
