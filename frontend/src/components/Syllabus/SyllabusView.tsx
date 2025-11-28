import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Card } from '../UI/Card';
import { Spinner } from '../UI/Spinner';
import { SyllabusNode, fetchSyllabusTree } from '../../services/syllabusApi';

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
        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition hover:bg-white/5 ${
          selected === node.id ? 'bg-primary/20 text-primary' : 'text-slate-300'
        }`}
        style={{ paddingLeft: 12 + depth * 12 }}
        onClick={() => onSelect(node.id)}
      >
        <div className="flex items-center gap-2">
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs text-primary"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((p) => !p);
            }}
          >
            {open ? '–' : '+'}
          </span>
          <span className="font-medium">{node.title}</span>
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
            <div className="ml-4 border-l border-white/10 pl-3">
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


const renderNodes = (nodes: SyllabusNode[], depth = 0) =>
  nodes.map((n) => (
    <Card key={n.id} className="mb-6">
      <p className="text-xs uppercase tracking-[0.22em] text-secondary">Level {depth + 1}</p>
      <h3 className="mt-1 text-xl font-semibold text-white">{n.title}</h3>
      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-300">{n.content}</p>
      {n.children.length > 0 && <div className="mt-4 space-y-4 border-l border-white/10 pl-4">{renderNodes(n.children, depth + 1)}</div>}
    </Card>
  ));


interface SyllabusViewProps {
    view: 'tree' | 'full';
}

export const SyllabusView: React.FC<SyllabusViewProps> = ({ view }) => {
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
          if (view === 'tree' && res.tree[0]) {
            setSelectedId(res.tree[0].id);
          }
        } catch (err: any) {
          setError(err.message || 'Failed to load syllabus');
        } finally {
          setLoading(false);
        }
      };
      load();
    }, [view]);

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

    if(loading) {
        return <Card><Spinner /></Card>
    }

    if(error) {
        return <p className="mb-3 text-sm text-rose-400">{error}</p>
    }
  
    if (view === 'tree') {
        return (
            <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
                <Card>
                <h3 className="mb-3 text-lg font-semibold text-white">Syllabus Outline</h3>
                <SyllabusTree nodes={tree} selected={selectedId} onSelect={setSelectedId} />
                </Card>
                <Card>
                {selected ? (
                    <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.22em] text-secondary">Section</p>
                    <h3 className="text-2xl font-semibold text-white">{selected.title}</h3>
                    <p className="whitespace-pre-line text-sm leading-relaxed text-slate-300">{selected.content}</p>
                    </div>
                ) : (
                    <p className="text-sm text-slate-400">Select a syllabus section to view details.</p>
                )}
                </Card>
            </div>
        );
    }

    if (view === 'full') {
        return <div className="space-y-4">{renderNodes(tree)}</div>
    }

    return null;
};