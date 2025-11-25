import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DashboardLayout } from '../components/Layout/DashboardLayout';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Spinner } from '../components/UI/Spinner';
import { SyllabusNode, fetchSyllabusTree } from '../services/syllabusApi';
import { useNavigate } from 'react-router-dom';

type TreeProps = {
  nodes: SyllabusNode[];
  selected: string | null;
  onSelect: (id: string) => void;
};

const SyllabusTree: React.FC<TreeProps> = ({ nodes, selected, onSelect }) => (
  <div className="space-y-1">
    {nodes.map((node) => (
      <TreeItem key={node.id} node={node} depth={0} selected={selected} onSelect={onSelect} />
    ))}
  </div>
);

const TreeItem: React.FC<{ node: SyllabusNode; depth: number; selected: string | null; onSelect: (id: string) => void }> = ({
  node,
  depth,
  selected,
  onSelect,
}) => {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button
        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition hover:bg-white/70 ${
          selected === node.id ? 'bg-blue-50 border border-blue-200 shadow text-blue-900' : ''
        }`}
        style={{ paddingLeft: 12 + depth * 12 }}
        onClick={() => onSelect(node.id)}
      >
        <div className="flex items-center gap-2">
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-xs text-blue-600"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((p) => !p);
            }}
          >
            {open ? '–' : '+'}
          </span>
          <span className="font-medium text-midnight">{node.title}</span>
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && node.children.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="ml-4 border-l border-slate-100 pl-3">
              {node.children.map((child) => (
                <TreeItem key={child.id} node={child} depth={depth + 1} selected={selected} onSelect={onSelect} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SyllabusPage: React.FC = () => {
  const navigate = useNavigate();
  const [tree, setTree] = useState<SyllabusNode[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchSyllabusTree();
        setTree(res.tree);
        if (res.tree[0]) setSelectedId(res.tree[0].id);
      } catch (err: any) {
        setError(err.message || 'Failed to load syllabus');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const selected = useMemo(() => {
    const find = (nodes: SyllabusNode[]): SyllabusNode | null => {
      for (const n of nodes) {
        if (n.id === selectedId) return n;
        const found = find(n.children);
        if (found) return found;
      }
      return null;
    };
    return find(tree);
  }, [tree, selectedId]);

  return (
    <DashboardLayout title="Syllabus">
      <div className="mb-4 flex items-center gap-3">
        <Button variant="primary" onClick={() => navigate('/syllabus/full')}>
          Open full syllabus
        </Button>
        <Button variant="ghost" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
        {error && <span className="text-sm text-rose-500">{error}</span>}
      </div>
      <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
        <Card className="bg-white/80">
          <h3 className="mb-3 text-lg font-semibold text-midnight">Syllabus Outline</h3>
          {loading ? <Spinner /> : <SyllabusTree nodes={tree} selected={selectedId} onSelect={setSelectedId} />}
        </Card>
        <Card className="bg-white/80">
          {loading ? (
            <Spinner />
          ) : selected ? (
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Section</p>
              <h3 className="text-2xl font-semibold text-midnight">{selected.title}</h3>
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">{selected.content}</p>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Select a syllabus section to view details.</p>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SyllabusPage;
