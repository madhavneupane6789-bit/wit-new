import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '../components/Layout/DashboardLayout';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { Badge } from '../components/UI/Badge';
import { Spinner } from '../components/UI/Spinner';
import { TreeView } from '../components/UI/TreeView';
import {
  FileItem,
  FolderNode,
  addBookmark,
  fetchAnnouncement,
  fetchUserTree,
  removeBookmark,
  setProgress,
  uploadAvatar,
  markOpened,
} from '../services/contentApi';
import { changePassword } from '../services/authApi';
import { useAuth } from '../hooks/useAuth';
import { SyllabusNode, fetchSyllabusTree } from '../services/syllabusApi';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const findFolder = (tree: FolderNode[], id: string | null): FolderNode | null => {
  if (!id) return null;
  for (const node of tree) {
    if (node.id === id) return node;
    const found = findFolder(node.children, id);
    if (found) return found;
  }
  return null;
};

const findSyllabus = (tree: SyllabusNode[], id: string | null): SyllabusNode | null => {
  if (!id) return null;
  for (const node of tree) {
    if (node.id === id) return node;
    const found = findSyllabus(node.children, id);
    if (found) return found;
  }
  return null;
};

const extractDriveId = (url: string): string | null => {
  // Patterns: /file/d/<id>/view, ?id=<id>, uc?id=<id>
  const matchPath = url.match(/\/d\/([^/]+)/);
  if (matchPath && matchPath[1]) return matchPath[1];
  const query = url.includes('?') ? url.split('?')[1] : '';
  const params = new URLSearchParams(query);
  const qId = params.get('id');
  if (qId) return qId;
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
      <motion.div initial={false} animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }} transition={{ duration: 0.2 }}>
        {open && node.children.length > 0 && (
          <div className="ml-4 border-l border-slate-100 pl-3">
            {node.children.map((child) => (
              <SyllabusTreeItem key={child.id} node={child} depth={depth + 1} selected={selected} onSelect={onSelect} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

const UserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tree, setTree] = useState<FolderNode[]>([]);
  const [rootFiles, setRootFiles] = useState<FileItem[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const [progress, setProgressValue] = useState<number>(0);
  const [now, setNow] = useState<string>(new Date().toLocaleString());
  const [pwdOld, setPwdOld] = useState('');
  const [pwdNew, setPwdNew] = useState('');
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'library' | 'bookmarks' | 'read' | 'syllabus'>('library');
  const [syllabusTree, setSyllabusTree] = useState<SyllabusNode[]>([]);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [syllabusLoading, setSyllabusLoading] = useState(false);
  const [playerFile, setPlayerFile] = useState<{ id: string; name: string; src: string } | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [data, ann] = await Promise.all([fetchUserTree(), fetchAnnouncement()]);
      setTree(data.tree);
      setRootFiles(data.rootFiles);
      setProgressValue(data.progress || 0);
      setAnnouncement(ann?.content || null);
    } catch (err: any) {
      setError(err.message || 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const loadSyllabus = async () => {
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
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await changePassword({ oldPassword: pwdOld, newPassword: pwdNew });
      setPwdOld('');
      setPwdNew('');
      alert('Password changed');
    } catch (err: any) {
      setError(err.message || 'Password change failed');
    }
  };

  useEffect(() => {
    load();
    loadSyllabus();
    const t = setInterval(() => setNow(new Date().toLocaleString()), 1000);
    return () => clearInterval(t);
  }, []);

  const currentFolder = useMemo(() => findFolder(tree, selectedFolder), [tree, selectedFolder]);
  const filesToShow = selectedFolder ? currentFolder?.files || [] : rootFiles;
  const currentSection = useMemo(() => findSyllabus(syllabusTree, selectedSection), [syllabusTree, selectedSection]);
  const viewSyllabus = (sectionId: string) => {
    setSelectedSection(sectionId);
    setActiveTab('syllabus');
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

  const bookmarks = allFiles.filter((f) => f.bookmarked);
  const overallProgress =
    progress || (allFiles.length ? Math.round((allFiles.filter((f) => f.completed).length / allFiles.length) * 100) : 0);
  const folderChildren = selectedFolder ? currentFolder?.children || [] : tree;

  const toggleBookmark = async (file: FileItem) => {
    try {
      if (file.bookmarked) {
        await removeBookmark(file.id);
      } else {
        await addBookmark(file.id);
      }
      await load();
    } catch (err: any) {
      setError(err.message || 'Bookmark update failed');
    }
  };

  const toggleCompleted = async (file: FileItem) => {
    try {
      await setProgress(file.id, !file.completed);
      await load();
    } catch (err: any) {
      setError(err.message || 'Progress update failed');
    }
  };

  const handleOpen = async (file: FileItem) => {
    try {
      await markOpened(file.id);
    } catch (err: any) {
      // non-blocking
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

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadAvatar(file);
      await load();
      alert('Avatar updated');
    } catch (err: any) {
      setError(err.message || 'Avatar upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout title="Dashboard">
      <div className="mb-4 flex flex-wrap gap-2">
        <Button variant={activeTab === 'library' ? 'primary' : 'ghost'} onClick={() => setActiveTab('library')}>
          Library
        </Button>
        <Button variant={activeTab === 'bookmarks' ? 'primary' : 'ghost'} onClick={() => setActiveTab('bookmarks')}>
          Bookmarks
        </Button>
        <Button variant={activeTab === 'read' ? 'primary' : 'ghost'} onClick={() => setActiveTab('read')}>
          Completed
        </Button>
        <Button variant={activeTab === 'syllabus' ? 'primary' : 'ghost'} onClick={() => setActiveTab('syllabus')}>
          Syllabus
        </Button>
        <Link to="/mcq">
          <Button variant="ghost">MCQ Practice</Button>
        </Link>
        <div className="ml-auto text-sm text-slate-500">Local time: {now}</div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card className="bg-white/80">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Welcome</p>
          <h3 className="mt-2 text-xl font-semibold text-midnight">Hello, {user?.name}</h3>
          <p className="text-sm text-slate-600">Browse your library and jump into resources quickly.</p>
          <div className="mt-2 flex items-center gap-3">
            {user?.avatarUrl && <img src={user.avatarUrl} alt="avatar" className="h-12 w-12 rounded-full object-cover" />}
            <label className="text-xs text-blue-600 cursor-pointer">
              {uploading ? 'Uploading...' : 'Change photo'}
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
            </label>
          </div>
          <div className="mt-3">
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: `${overallProgress}%` }} />
            </div>
            <p className="mt-1 text-xs text-slate-500">{overallProgress}% completed</p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/90 to-cyan-400/80 text-white">
          <p className="text-xs uppercase tracking-[0.22em] text-white/80">Status</p>
          <h3 className="mt-2 text-xl font-semibold">Access</h3>
          <p className="text-sm text-white/80">
            {user?.isApproved ? 'Content unlocked by admin.' : 'Waiting for admin approval. Contact support to unlock.'}
          </p>
        </Card>
        <Card className="bg-white/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Content</p>
              <h3 className="mt-2 text-xl font-semibold text-midnight">Library</h3>
            </div>
            <Button variant="ghost" onClick={load}>
              Refresh
            </Button>
          </div>
          <p className="text-sm text-slate-600">Updated tree with nested folders and quick links.</p>
        </Card>
      </div>

      {announcement && (
        <Card className="mb-6 bg-white/90">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Message from admin</p>
          <p className="mt-2 text-midnight">{announcement}</p>
        </Card>
      )}

      {!user?.isApproved && (
        <Card className="mb-6 bg-amber-50 border border-amber-200">
          <p className="text-sm font-semibold text-amber-700">Content locked</p>
          <p className="text-sm text-amber-700">Please contact admin to unlock your account.</p>
        </Card>
      )}

      {activeTab === 'library' && (
        <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
          <Card className="bg-white/80">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-midnight">Content Tree</h3>
            </div>
            {loading ? <Spinner /> : <TreeView tree={tree} selectedId={selectedFolder} onSelect={(id) => setSelectedFolder(id)} />}
          </Card>
          <Card className="bg-white/80">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Files</p>
                <h3 className="text-xl font-semibold text-midnight">{selectedFolder ? currentFolder?.name : 'Root Files'}</h3>
              </div>
            </div>
            {error && <p className="text-sm text-rose-500">{error}</p>}
            {loading ? (
              <Spinner />
            ) : (
              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Sub-folders</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {folderChildren.length === 0 && <p className="text-sm text-slate-500">No folders here.</p>}
                    {folderChildren.map((f) => (
                      <motion.div
                        key={f.id}
                        className="rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition cursor-pointer"
                        initial={{ opacity: 0.9 }}
                        animate={{ opacity: 1 }}
                        onClick={() => setSelectedFolder(f.id)}
                      >
                        <h4 className="text-lg font-semibold text-midnight">{f.name}</h4>
                        {f.description && <p className="text-sm text-slate-600">{f.description}</p>}
                        <p className="text-xs text-slate-500 mt-1">{f.files.length} files · {f.children.length} sub-folders</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Files</p>
                    {selectedFolder && (
                      <Button variant="ghost" onClick={() => setSelectedFolder(null)}>
                        ← Back
                      </Button>
                    )}
                  </div>
                  {currentFolder?.syllabusSections && currentFolder.syllabusSections.length > 0 && (
                    <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50/70 p-3 text-sm text-blue-800">
                      <p className="text-xs uppercase tracking-[0.2em] text-blue-700">Related syllabus</p>
                      <ul className="mt-1 list-disc space-y-1 pl-4">
                        {currentFolder.syllabusSections.map((s) => (
                          <li key={s.id} className="flex items-center justify-between">
                            <span>{s.title}</span>
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
                          className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div>
                            <h4 className="text-lg font-semibold text-midnight">{file.name}</h4>
                            {file.description && <p className="text-sm text-slate-600">{file.description}</p>}
                            <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
                              <Badge variant={file.fileType === 'VIDEO' ? 'blue' : 'slate'}>
                                {file.fileType === 'VIDEO' ? 'Video' : 'PDF'}
                              </Badge>
                              {file.completed && <span className="text-emerald-600">Completed</span>}
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
                      <p className="text-sm text-slate-500">No files in this folder yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {activeTab === 'bookmarks' && (
        <div className="mt-6">
          <Card className="bg-white/80">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Bookmarks</p>
                <h3 className="text-xl font-semibold text-midnight">Saved files</h3>
              </div>
            </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {bookmarks.length === 0 && <p className="text-sm text-slate-500">No bookmarks yet.</p>}
                    {bookmarks.map((file) => (
                      <div
                        key={file.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-sm"
                >
                  <div>
                    <h4 className="font-semibold text-midnight">{file.name}</h4>
                    <p className="text-xs text-slate-500">{file.fileType}</p>
                    {file.lastOpenedAt && <p className="text-xs text-slate-500">Last opened: {new Date(file.lastOpenedAt).toLocaleString()}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => toggleCompleted(file)} disabled={!user?.isApproved}>
                      {file.completed ? '✓' : '○'}
                    </Button>
                    <Button variant="ghost" onClick={() => toggleBookmark(file)} disabled={!user?.isApproved}>
                      Remove
                    </Button>
                    <Button onClick={() => handleOpen(file)} disabled={!user?.isApproved}>
                      Open
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'read' && (
        <div className="mt-6">
          <Card className="bg-white/80">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Completed</p>
                <h3 className="text-xl font-semibold text-midnight">Read files</h3>
              </div>
            </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {allFiles.filter((f) => f.completed).length === 0 && <p className="text-sm text-slate-500">No files marked completed.</p>}
                    {allFiles
                      .filter((f) => f.completed)
                      .map((file) => (
                  <div key={file.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-sm">
                    <div>
                      <h4 className="font-semibold text-midnight">{file.name}</h4>
                      <p className="text-xs text-slate-500">{file.fileType}</p>
                      {file.lastOpenedAt && (
                        <p className="text-xs text-slate-500">Last opened: {new Date(file.lastOpenedAt).toLocaleString()}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => toggleCompleted(file)}
                        disabled={!user?.isApproved}
                        title={file.completed ? 'Mark as unread' : 'Mark as read'}
                      >
                        {file.completed ? '✓' : '○'}
                      </Button>
                      <Button onClick={() => handleOpen(file)} disabled={!user?.isApproved} title="Open file">
                        Open
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'syllabus' && (
        <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
          <Card className="bg-white/80">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-midnight">Syllabus</h3>
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
          <Card className="bg-white/80">
            {syllabusLoading ? (
              <Spinner />
            ) : currentSection ? (
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Section</p>
                <h3 className="text-2xl font-semibold text-midnight">{currentSection.title}</h3>
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">{currentSection.content}</p>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Select a syllabus section to view details.</p>
            )}
          </Card>
        </div>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card className="bg-white/80">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Change Password</p>
          <form className="mt-3 space-y-3" onSubmit={handleChangePassword}>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-midnight focus:border-blue-400 focus:outline-none"
              placeholder="Old password"
              type="password"
              value={pwdOld}
              onChange={(e) => setPwdOld(e.target.value)}
              required
            />
            <input
              className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-midnight focus:border-blue-400 focus:outline-none"
              placeholder="New password"
              type="password"
              value={pwdNew}
              onChange={(e) => setPwdNew(e.target.value)}
              required
            />
            <Button type="submit" disabled={!pwdOld || !pwdNew}>
              Update password
            </Button>
          </form>
        </Card>
      </div>

      {playerFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4">
          <div className="w-full max-w-4xl rounded-2xl bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Now playing</p>
                <h3 className="text-lg font-semibold text-midnight">{playerFile.name}</h3>
              </div>
              <Button variant="ghost" onClick={() => setPlayerFile(null)}>
                Close
              </Button>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-black">
              <iframe
                key={playerFile.src}
                src={playerFile.src}
                className="h-[480px] w-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="Drive video player"
              />
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default UserDashboardPage;
