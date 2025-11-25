import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/Layout/DashboardLayout';
import { Card } from '../components/UI/Card';
import { Spinner } from '../components/UI/Spinner';
import { SyllabusNode, fetchSyllabusTree } from '../services/syllabusApi';
import { useNavigate } from 'react-router-dom';

const renderNodes = (nodes: SyllabusNode[], depth = 0) =>
  nodes.map((n) => (
    <div key={n.id} className="mb-6 rounded-2xl bg-white/80 p-5 shadow-sm">
      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Level {depth + 1}</p>
      <h3 className="mt-1 text-xl font-semibold text-midnight">{n.title}</h3>
      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">{n.content}</p>
      {n.children.length > 0 && <div className="mt-4 space-y-4 border-l border-slate-100 pl-4">{renderNodes(n.children, depth + 1)}</div>}
    </div>
  ));

const SyllabusFullPage: React.FC = () => {
  const navigate = useNavigate();
  const [tree, setTree] = useState<SyllabusNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchSyllabusTree();
        setTree(res.tree);
      } catch (err: any) {
        setError(err.message || 'Failed to load syllabus');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <DashboardLayout title="Full Syllabus">
      <div className="mb-4">
        <Button variant="ghost" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
      {error && <p className="mb-3 text-sm text-rose-500">{error}</p>}
      {loading ? (
        <Card className="bg-white/80">
          <Spinner />
        </Card>
      ) : (
        <div className="space-y-4">{renderNodes(tree)}</div>
      )}
    </DashboardLayout>
  );
};

export default SyllabusFullPage;
