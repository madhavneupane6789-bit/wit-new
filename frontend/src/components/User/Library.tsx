import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { Badge } from '../UI/Badge';
import { Spinner } from '../UI/Spinner';
import { TreeView } from '../UI/TreeView';
import {
  FileItem,
  FolderNode,
  addBookmark,
  fetchUserTree,
  removeBookmark,
  setProgress,
  markOpened,
} from '../../services/contentApi';
import { useAuth } from '../../hooks/useAuth';

const findFolder = (tree: FolderNode[], id: string | null): FolderNode | null => {
  if (!id) return null;
  for (const node of tree) {
    if (node.id === id) return node;
    const found = findFolder(node.children, id);
    if (found) return found;
  }
  return null;
};

const extractDriveId = (url: string): string | null => {
  const matchPath = url.match(/\/d\/([^/]+)/);
  if (matchPath && matchPath[1]) return matchPath[1];
  const query = url.includes('?') ? url.split('?')[1] : '';
  const params = new URLSearchParams(query);
  const qId = params.get('id');
  if (qId) return qId;
  return null;
};

interface LibraryProps {
  viewSyllabus: (sectionId: string) => void;
  setPlayerFile: (file: { id: string; name: string; src: string } | null) => void;
}

export const Library: React.FC<LibraryProps> = ({ viewSyllabus, setPlayerFile }) => {
  const { user } = useAuth();
  const [tree, setTree] = useState<FolderNode[]>([]);
  const [rootFiles, setRootFiles] = useState<FileItem[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    setError(null);
    try {
      const data = await fetchUserTree();
      setTree(data.tree);
      setRootFiles(data.rootFiles);
    } catch (err: any) {
      setError(err.message || 'Failed to load content');
    } finally {
      if (showSpinner) setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const currentFolder = useMemo(() => findFolder(tree, selectedFolder), [tree, selectedFolder]);
  const filesToShow = selectedFolder ? currentFolder?.files || [] : rootFiles;
  const folderChildren = selectedFolder ? currentFolder?.children || [] : tree;
  const subfolderScrollable = folderChildren.length > 4;
  const filesScrollable = (filesToShow?.length || 0) > 4;
  const updateFileLocally = (fileId: string, updater: (f: FileItem) => Partial<FileItem>) => {
    let nextRoots: FileItem[] = [];
    setRootFiles((prev) => {
      nextRoots = prev.map((f) => (f.id === fileId ? { ...f, ...updater(f) } : f));
      return nextRoots;
    });

    setTree((prev) => {
      const walk = (nodes: FolderNode[]): FolderNode[] =>
        nodes.map((n) => ({
          ...n,
          files: n.files.map((f) => (f.id === fileId ? { ...f, ...updater(f) } : f)),
          children: walk(n.children),
        }));
      return walk(prev);
    });
  };
  
  const allFiles = useMemo(() => {
    const flat: FileItem[] = [...rootFiles];
    const walk = (nodes: FolderNode[]) => {
      nodes.forEach((n) => {
        flat.push(...n.files);
        walk(n.children);
      });
    };
    walk(tree);
    return flat;
  }, [tree, rootFiles]);

  const toggleBookmark = async (file: FileItem) => {
    try {
      if (file.bookmarked) {
        await removeBookmark(file.id);
      } else {
        await addBookmark(file.id);
      }
      updateFileLocally(file.id, (f) => ({ bookmarked: !f.bookmarked }));
    } catch (err: any) {
      setError(err.message || 'Bookmark update failed');
    }
  };

  const toggleCompleted = async (file: FileItem) => {
    try {
      await setProgress(file.id, !file.completed);
      updateFileLocally(file.id, (f) => ({ completed: !f.completed }));
    } catch (err: any) {
      setError(err.message || 'Progress update failed');
    }
  };

  const handleOpen = async (file: FileItem) => {
    try {
      await markOpened(file.id);
    } catch (err: any) {
      console.warn(err);
    } finally {
      if (file.fileType === 'VIDEO') {
        const fileId = extractDriveId(file.googleDriveUrl);
        const preview = fileId ? `https://drive.google.com/file/d/${fileId}/preview` : file.googleDriveUrl;
        setPlayerFile({ id: fileId || file.id, name: file.name, src: preview });
      } else {
        window.open(file.googleDriveUrl, '_blank');
      }
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[320px,1fr]">
      <Card className="hidden lg:block">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Content Tree</h3>
        </div>
        <div className="max-h-[70vh] overflow-auto pr-2">
          {loading ? <Spinner /> : <TreeView tree={tree} selectedId={selectedFolder} onSelect={(id) => setSelectedFolder(id)} />}
        </div>
      </Card>
      <Card className="min-h-[60vh]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-secondary">Files</p>
            <h3 className="text-xl font-semibold text-white">{selectedFolder ? currentFolder?.name : 'Root Files'}</h3>
          </div>
        </div>
        {error && <p className="text-sm text-rose-500">{error}</p>}
        {loading ? (
          <Spinner />
        ) : (
          <div className="space-y-6">
            <div className="relative max-h-[40vh] overflow-auto pr-2">
              {subfolderScrollable && (
                <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.12em] text-slate-400">
                  Scroll ↓
                </div>
              )}
              <p className="text-xs uppercase tracking-[0.22em] text-secondary">Sub-folders</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                {folderChildren.length === 0 && <p className="text-sm text-slate-400">No folders here.</p>}
                {folderChildren.map((f) => (
                  <motion.div
                    key={f.id}
                    className="glass rounded-2xl p-4 transition-all hover:bg-white/10 cursor-pointer"
                    initial={{ opacity: 0.9 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setSelectedFolder(f.id)}
                  >
                    <h4 className="text-lg font-semibold text-white">{f.name}</h4>
                    {f.description && <p className="text-sm text-slate-300">{f.description}</p>}
                    <p className="text-xs text-slate-400 mt-1">{f.files.length} files · {f.children.length} sub-folders</p>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="relative max-h-[50vh] overflow-auto pr-2">
              {filesScrollable && (
                <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.12em] text-slate-400">
                  Scroll ↓
                </div>
              )}
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.22em] text-secondary">Files</p>
                {selectedFolder && (
                  <Button variant="ghost" onClick={() => setSelectedFolder(null)}>
                    ← Back
                  </Button>
                )}
              </div>
              {currentFolder?.syllabusSections && currentFolder.syllabusSections.length > 0 && (
                <div className="mt-3 rounded-xl border border-primary/20 bg-primary/10 p-3 text-sm text-primary">
                  <p className="text-xs uppercase tracking-[0.2em] text-primary/80">Related syllabus</p>
                  <ul className="mt-1 list-disc space-y-1 pl-4">
                    {currentFolder.syllabusSections.map((s) => (
                      <li key={s.id} className="flex items-center justify-between">
                        <span className="text-slate-300">{s.title}</span>
                        <Button variant="ghost" onClick={() => viewSyllabus(s.id)}>
                          View
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-3 space-y-3">
                {filesToShow && filesToShow.length > 0 ? (
                  filesToShow.map((file) => (
                    <motion.div
                      key={file.id}
                      className="glass flex items-center justify-between rounded-2xl p-4 transition-all hover:bg-white/5"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div>
                        <h4 className="text-lg font-semibold text-white">{file.name}</h4>
                        {file.description && <p className="text-sm text-slate-300">{file.description}</p>}
                        <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                          <Badge variant={file.fileType === 'VIDEO' ? 'blue' : 'slate'}>
                            {file.fileType === 'VIDEO' ? 'Video' : 'PDF'}
                          </Badge>
                          {file.completed && <span className="text-emerald-400">Completed</span>}
                          {file.lastOpenedAt && <span>Last opened: {new Date(file.lastOpenedAt).toLocaleString()}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => toggleBookmark(file)}
                      disabled={!user?.isApproved}
                      title={file.bookmarked ? 'Remove bookmark' : 'Add to bookmarks'}
                    >
                      {file.bookmarked ? '★' : '☆'}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => toggleCompleted(file)}
                      disabled={!user?.isApproved}
                      title={file.completed ? 'Mark as unread' : 'Mark as read'}
                    >
                      {file.completed ? '✓' : '○'}
                    </Button>
                        <Button onClick={() => handleOpen(file)} disabled={!user?.isApproved}>
                          Open
                        </Button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">No files in this folder yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
