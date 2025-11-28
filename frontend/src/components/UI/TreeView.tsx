import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import { FolderNode } from '../../services/contentApi';

type TreeProps = {
  tree: FolderNode[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
};

export const TreeView: React.FC<TreeProps> = ({ tree, selectedId, onSelect }) => {
  return (
    <div className="space-y-2 text-sm text-slate-300">
      <button
        className={clsx(
          'flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition hover:bg-white/5',
          selectedId === null && 'bg-white/10 shadow',
        )}
        onClick={() => onSelect(null)}
      >
        <span className="font-semibold">Root</span>
      </button>
      <div className="space-y-1">
        {tree.map((node) => (
          <TreeItem key={node.id} node={node} depth={0} selectedId={selectedId} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
};

type ItemProps = {
  node: FolderNode;
  depth: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
};

const TreeItem: React.FC<ItemProps> = ({ node, depth, selectedId, onSelect }) => {
  const [open, setOpen] = useState(true);
  const hasChildren = node.children.length > 0 || node.files.length > 0;

  return (
    <div className="rounded-xl">
      <button
        className={clsx(
          'flex w-full items-center justify-between rounded-xl px-3 py-2 text-left transition hover:bg-white/5',
          selectedId === node.id && 'bg-primary/20 text-primary shadow',
        )}
        style={{ paddingLeft: 12 + depth * 12 }}
        onClick={() => onSelect(node.id)}
      >
        <div className="flex items-center gap-2">
          <span
            className={clsx(
              'flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs',
              hasChildren ? 'text-primary' : 'text-slate-400',
            )}
            onClick={(e) => {
              e.stopPropagation();
              setOpen((prev) => !prev);
            }}
          >
            {open ? '–' : '+'}
          </span>
          <span className="font-medium text-slate-200">{node.name}</span>
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="ml-4 space-y-1 border-l border-white/10 pl-3">
              {node.children.map((child) => (
                <TreeItem key={child.id} node={child} depth={depth + 1} selectedId={selectedId} onSelect={onSelect} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
