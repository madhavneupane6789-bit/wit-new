import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { Spinner } from '../UI/Spinner';
import { SyllabusNode, fetchSyllabusTree } from '../../services/syllabusApi';
import { useNavigate } from 'react-router-dom';

const findSyllabus = (tree: SyllabusNode[], id: string | null): SyllabusNode | null => {
    if (!id) return null;
    for (const node of tree) {
      if (node.id === id) return node;
      const found = findSyllabus(node.children, id);
      if (found) return found;
    }
    return null;
  };

const SyllabusTreeItem: React.FC<{
  node: SyllabusNode;
  depth: number;
  selected: string | null;
  onSelect: (id: string) => void;
}> = ({ node, depth, selected, onSelect }) => {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button
        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition hover:bg-white/5 ${
          selected === node.id ? 'bg-primary/20 text-primary shadow' : ''
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
          <span className="font-medium text-slate-200">{node.title}</span>
        </div>
      </button>
      <motion.div initial={false} animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }} transition={{ duration: 0.2 }}>
        {open && node.children.length > 0 && (
          <div className="ml-4 border-l border-white/10 pl-3">
            {node.children.map((child) => (
              <SyllabusTreeItem key={child.id} node={child} depth={depth + 1} selected={selected} onSelect={onSelect} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export const Syllabus: React.FC = () => {
    const navigate = useNavigate();
    const [syllabusTree, setSyllabusTree] = useState<SyllabusNode[]>([]);
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [syllabusLoading, setSyllabusLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadSyllabus = useCallback(async () => {
        setSyllabusLoading(true);
        try {
          const res = await fetchSyllabusTree();
          setSyllabusTree(res.tree);
          if (res.tree[0]) setSelectedSection((prev) => prev || res.tree[0].id);
        } catch (err: any) {
          setError(err.message || 'Failed to load syllabus');
        } finally {
          setSyllabusLoading(false);
        }
    }, []);

    useEffect(() => {
        loadSyllabus();
    }, [loadSyllabus]);

    const currentSection = useMemo(() => findSyllabus(syllabusTree, selectedSection), [syllabusTree, selectedSection]);

    return (
        <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
            {error && <p className="text-sm text-rose-500">{error}</p>}
            <Card>
                <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Syllabus</h3>
                <Button variant="ghost" onClick={() => navigate('/syllabus/full')}>
                    Full view
                </Button>
                </div>
                {syllabusLoading ? (
                <Spinner />
                ) : (
                <div className="space-y-1 text-sm">
                    {syllabusTree.map((node) => (
                    <SyllabusTreeItem
                        key={node.id}
                        node={node}
                        depth={0}
                        selected={selectedSection}
                        onSelect={(id) => setSelectedSection(id)}
                    />
                    ))}
                </div>
                )}
            </Card>
            <Card>
                {syllabusLoading ? (
                <Spinner />
                ) : currentSection ? (
                <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.22em] text-secondary">Section</p>
                    <h3 className="text-2xl font-semibold text-white">{currentSection.title}</h3>
                    <p className="whitespace-pre-line text-sm leading-relaxed text-slate-300">{currentSection.content}</p>
                </div>
                ) : (
                <p className="text-sm text-slate-400">Select a syllabus section to view details.</p>
                )}
            </Card>
        </div>
    );
}
