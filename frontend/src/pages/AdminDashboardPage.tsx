import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { DashboardLayout } from '../components/Layout/DashboardLayout';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { Modal } from '../components/UI/Modal';
import { Badge } from '../components/UI/Badge';
import { Spinner } from '../components/UI/Spinner';
import { TreeView } from '../components/UI/TreeView';
import {
  FileItem,
  FolderNode,
  createFile,
  createFolder,
  deleteFile,
  deleteFolder,
  fetchAdminTree,
  reorderFiles,
  reorderFolders,
  updateFile,
  updateFolder,
  setAnnouncement,
} from '../services/contentApi';
import {
  listUsers,
  createUser as adminCreateUser,
  updateUser as adminUpdateUser,
  deleteUser as adminDeleteUser,
  fetchUserProgressSummary,
  fetchUserDetails,
} from '../services/adminApi';
import { uploadMedia } from '../services/contentApi';
import { changePassword } from '../services/authApi';
import { User } from '../services/authApi';
import { SyllabusNode, fetchSyllabusTree, updateSyllabusSection } from '../services/syllabusApi';
import { MCQQuestion, adminCreateMcq, adminDeleteMcq, fetchMcqQuestions } from '../services/mcqApi';

const findFolder = (tree: FolderNode[], id: string | null): FolderNode | null => {
  if (!id) return null;
  for (const node of tree) {
    if (node.id === id) return node;
    const found = findFolder(node.children, id);
    if (found) return found;
  }
  return null;
};

const flattenSyllabus = (nodes: SyllabusNode[], prefix = ''): { id: string; label: string }[] => {
  const list: { id: string; label: string }[] = [];
  nodes.forEach((n) => {
    const label = prefix ? `${prefix} › ${n.title}` : n.title;
    list.push({ id: n.id, label });
    list.push(...flattenSyllabus(n.children, label));
  });
  return list;
};

const AdminDashboardPage: React.FC = () => {
  const [tree, setTree] = useState<FolderNode[]>([]);
  const [rootFiles, setRootFiles] = useState<FileItem[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [announcementText, setAnnouncementText] = useState('');
  const [view, setView] = useState<'content' | 'users' | 'mcq'>('content');
  const [progressSummary, setProgressSummary] = useState<{ id: string; name: string; email: string; completed: number; bookmarks: number; percent: number }[]>([]);
  const [selectedUserStats, setSelectedUserStats] = useState<{ userId: string; bookmarks: number; progress: number; percent: number } | null>(null);
  const [pwdOld, setPwdOld] = useState('');
  const [pwdNew, setPwdNew] = useState('');
  const [syllabusTree, setSyllabusTree] = useState<SyllabusNode[]>([]);
  const [syllabusLoading, setSyllabusLoading] = useState(false);
  const [linkingSectionId, setLinkingSectionId] = useState<string>('');
  const [mcqForm, setMcqForm] = useState({
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctOption: 'A' as 'A' | 'B' | 'C' | 'D',
    explanation: '',
  });
  const [mcqList, setMcqList] = useState<MCQQuestion[]>([]);

  const [users, setUsers] = useState<User[]>([]);
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'USER' as 'USER' | 'ADMIN' });

  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [folderForm, setFolderForm] = useState({ name: '', description: '' });
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);

  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [fileForm, setFileForm] = useState({
    name: '',
    description: '',
    fileType: 'VIDEO' as 'VIDEO' | 'PDF',
    googleDriveUrl: '',
  });
  const [editingFileId, setEditingFileId] = useState<string | null>(null);

  const loadContent = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminTree();
      setTree(data.tree);
      setRootFiles(data.rootFiles);
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
    } catch (err: any) {
      setError(err.message || 'Failed to load syllabus');
    } finally {
      setSyllabusLoading(false);
    }
  };

  const loadMcq = async () => {
    try {
      const res = await fetchMcqQuestions();
      setMcqList(res);
    } catch (err: any) {
      setError(err.message || 'Failed to load MCQs');
    }
  };

  const loadUsers = async () => {
    try {
      const data = await listUsers();
      setUsers(data);
      const summary = await fetchUserProgressSummary();
      setProgressSummary(summary.summaries);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
    }
  };

  useEffect(() => {
    loadContent();
    loadUsers();
    loadSyllabus();
    loadMcq();
  }, []);

  const currentFolder = useMemo(() => findFolder(tree, selectedFolder), [tree, selectedFolder]);
  const filesToShow = selectedFolder ? currentFolder?.files || [] : rootFiles;
  const folderChildren = selectedFolder ? currentFolder?.children || [] : tree;
  const syllabusOptions = useMemo(() => flattenSyllabus(syllabusTree), [syllabusTree]);
  const linkedSections = currentFolder?.syllabusSections || [];

  const openCreateFolder = () => {
    setEditingFolderId(null);
    setFolderForm({ name: '', description: '' });
    setFolderModalOpen(true);
  };

  const openEditFolder = () => {
    if (!currentFolder) return;
    setEditingFolderId(currentFolder.id);
    setFolderForm({ name: currentFolder.name, description: currentFolder.description || '' });
    setFolderModalOpen(true);
  };

  const submitFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFolderId) {
        await updateFolder(editingFolderId, { name: folderForm.name, description: folderForm.description });
      } else {
        await createFolder({ name: folderForm.name, description: folderForm.description || undefined, parentId: selectedFolder || undefined });
      }
      setFolderModalOpen(false);
      loadContent();
    } catch (err: any) {
      setError(err.message || 'Folder save failed');
    }
  };

  const handleDeleteFolder = async () => {
    if (!selectedFolder) return;
    if (!confirm('Delete this folder? Ensure it is empty.')) return;
    try {
      await deleteFolder(selectedFolder);
      setSelectedFolder(null);
      loadContent();
    } catch (err: any) {
      setError(err.message || 'Delete failed');
    }
  };

  const openCreateFile = () => {
    setEditingFileId(null);
    setFileForm({ name: '', description: '', fileType: 'VIDEO', googleDriveUrl: '' });
    setFileModalOpen(true);
  };

  const openEditFile = (file: FileItem) => {
    setEditingFileId(file.id);
    setFileForm({
      name: file.name,
      description: file.description || '',
      fileType: file.fileType,
      googleDriveUrl: file.googleDriveUrl,
    });
    setFileModalOpen(true);
  };

  const submitFile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFileId) {
        await updateFile(editingFileId, {
          ...fileForm,
          folderId: selectedFolder,
        });
      } else {
        await createFile({
          ...fileForm,
          folderId: selectedFolder,
        });
      }
      setFileModalOpen(false);
      loadContent();
    } catch (err: any) {
      setError(err.message || 'File save failed');
    }
  };

  const handleDeleteFile = async (id: string) => {
    if (!confirm('Delete this file?')) return;
    try {
      await deleteFile(id);
      loadContent();
    } catch (err: any) {
      setError(err.message || 'Delete failed');
    }
  };

  const handleLinkSection = async () => {
    if (!selectedFolder || !linkingSectionId) return;
    try {
      await updateSyllabusSection(linkingSectionId, { folderId: selectedFolder });
      setLinkingSectionId('');
      await Promise.all([loadSyllabus(), loadContent()]);
    } catch (err: any) {
      setError(err.message || 'Failed to link syllabus');
    }
  };

  const handleUnlinkSection = async (sectionId: string) => {
    try {
      await updateSyllabusSection(sectionId, { folderId: null });
      await Promise.all([loadSyllabus(), loadContent()]);
    } catch (err: any) {
      setError(err.message || 'Failed to unlink syllabus');
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const ids = result.source.droppableId === 'files' ? [...filesToShow.map((f) => f.id)] : [...folderChildren.map((f) => f.id)];
    const [removed] = ids.splice(result.source.index, 1);
    ids.splice(result.destination.index, 0, removed);
    try {
      if (result.source.droppableId === 'files') {
        await reorderFiles(selectedFolder, ids);
        await loadContent();
      } else {
        await reorderFolders(selectedFolder, ids);
        await loadContent();
      }
    } catch (err: any) {
      setError(err.message || 'Reorder failed');
    }
  };

  const submitAnnouncement = async () => {
    if (!announcementText.trim()) return;
    try {
      await setAnnouncement(announcementText.trim(), true);
      setAnnouncementText('');
      alert('Message sent to users.');
    } catch (err: any) {
      setError(err.message || 'Failed to save message');
    }
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await uploadMedia(file, 'dashboard');
      alert('Media uploaded');
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminCreateUser({ ...userForm, isApproved: true });
      setUserForm({ name: '', email: '', password: '', role: 'USER' });
      loadUsers();
    } catch (err: any) {
      setError(err.message || 'User create failed');
    }
  };

  const toggleApproval = async (u: User) => {
    try {
      await adminUpdateUser(u.id, { isApproved: !u.isApproved });
      loadUsers();
    } catch (err: any) {
      setError(err.message || 'Update failed');
    }
  };

  const deactivateUser = async (u: User) => {
    if (!confirm('Deactivate user?')) return;
    try {
      await adminUpdateUser(u.id, { isActive: !u.isActive });
      loadUsers();
    } catch (err: any) {
      setError(err.message || 'Update failed');
    }
  };

  const removeUser = async (u: User) => {
    if (!confirm('Delete this user?')) return;
    try {
      await adminDeleteUser(u.id);
      loadUsers();
    } catch (err: any) {
      setError(err.message || 'Delete failed');
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

  const viewUserStats = async (u: User) => {
    try {
      const stats = await fetchUserDetails(u.id);
      setSelectedUserStats({
        userId: u.id,
        bookmarks: stats.bookmarks.length,
        progress: stats.completedCount,
        percent: stats.percent,
      });
    } catch (err: any) {
      setError(err.message || 'Stats fetch failed');
    }
  };

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="mb-4 flex gap-2">
        <Button variant={view === 'content' ? 'primary' : 'ghost'} onClick={() => setView('content')}>
          Content
        </Button>
        <Button variant={view === 'users' ? 'primary' : 'ghost'} onClick={() => setView('users')}>
          Users
        </Button>
        <Button variant={view === 'mcq' ? 'primary' : 'ghost'} onClick={() => setView('mcq' as any)}>
          MCQ Bank
        </Button>
      </div>

      {view === 'content' && (
        <>
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <Card className="bg-white/80">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Overview</p>
              <h3 className="mt-2 text-xl font-semibold text-midnight">Content tree</h3>
              <p className="text-sm text-slate-600">Manage nested folders, ordering, and links.</p>
            </Card>
            <Card className="bg-gradient-to-br from-blue-500/90 to-cyan-400/80 text-white">
              <p className="text-xs uppercase tracking-[0.22em] text-white/80">Status</p>
              <h3 className="mt-2 text-xl font-semibold">Ordering</h3>
              <p className="text-sm text-white/80">Drag to reorder folders/files. Order is respected over names.</p>
            </Card>
            <Card className="bg-white/80">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Actions</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button onClick={openCreateFolder}>Add Folder</Button>
                <Button variant="ghost" onClick={openCreateFile}>
                  Add File
                </Button>
                <Button variant="ghost" onClick={loadContent}>
                  Refresh
                </Button>
              </div>
            </Card>
          </div>

          <Card className="mb-6 bg-white/90">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Message to users</p>
            <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-center">
              <input
                className="flex-1 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-midnight focus:border-blue-400 focus:outline-none"
                placeholder="Announcement text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
              />
              <Button onClick={submitAnnouncement}>Send</Button>
              <div className="text-xs text-slate-500">
                <label className="font-semibold text-midnight">Upload banner/media: </label>
                <input type="file" accept="image/*" onChange={handleMediaUpload} />
              </div>
            </div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
            <Card className="bg-white/80">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-midnight">Folder Tree</h3>
              </div>
              {loading ? (
                <Spinner />
              ) : (
                <TreeView tree={tree} selectedId={selectedFolder} onSelect={(id) => setSelectedFolder(id)} />
              )}
              <div className="mt-4 flex gap-2">
                {selectedFolder && (
                  <>
                    <Button variant="ghost" onClick={openEditFolder}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={handleDeleteFolder}>
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </Card>

            <Card className="bg-white/80">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Files</p>
                  <h3 className="text-xl font-semibold text-midnight">{selectedFolder ? currentFolder?.name : 'Root Files'}</h3>
                </div>
                <Button onClick={openCreateFile}>Add File</Button>
              </div>
              {error && <p className="text-sm text-rose-500">{error}</p>}
              {loading ? (
                <Spinner />
              ) : (
                <div className="space-y-3">
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="folders">
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                          <p className="text-xs font-semibold text-slate-500">Sub-folders</p>
                          {folderChildren.map((folder, idx) => (
                            <Draggable key={folder.id} draggableId={folder.id} index={idx}>
                              {(drag) => (
                                <div
                                  ref={drag.innerRef}
                                  {...drag.draggableProps}
                                  {...drag.dragHandleProps}
                                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-white/70 px-3 py-2"
                                >
                                  <span>{folder.name}</span>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                    <div className="mt-4 space-y-2 rounded-2xl border border-slate-100 bg-white/80 p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-slate-600">Syllabus mapping</p>
                        <Button variant="ghost" onClick={loadSyllabus} disabled={syllabusLoading}>
                          Refresh
                        </Button>
                      </div>
                      {linkedSections.length === 0 && <p className="text-sm text-slate-500">No syllabus linked to this folder.</p>}
                      {linkedSections.map((s) => (
                        <div key={s.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white/70 px-3 py-2 text-sm">
                          <span>{s.title}</span>
                          <Button variant="ghost" onClick={() => handleUnlinkSection(s.id)}>
                            Unlink
                          </Button>
                        </div>
                      ))}
                      <div className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-white/70 px-3 py-3">
                        <select
                          value={linkingSectionId}
                          onChange={(e) => setLinkingSectionId(e.target.value)}
                          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        >
                          <option value="">Select syllabus section</option>
                          {syllabusOptions.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <Button onClick={handleLinkSection} disabled={!linkingSectionId || !selectedFolder}>
                          Link to this folder
                        </Button>
                      </div>
                    </div>
                    <Droppable droppableId="files">
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2 pt-4">
                          <p className="text-xs font-semibold text-slate-500">Files</p>
                          {filesToShow.map((file, idx) => (
                            <Draggable key={file.id} draggableId={file.id} index={idx}>
                              {(drag) => (
                                <motion.div
                                  ref={drag.innerRef}
                                  {...drag.draggableProps}
                                  {...drag.dragHandleProps}
                                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-sm"
                                  initial={{ opacity: 0.9 }}
                                  animate={{ opacity: 1 }}
                                >
                                  <div>
                                    <h4 className="text-lg font-semibold text-midnight">{file.name}</h4>
                                    {file.description && <p className="text-sm text-slate-600">{file.description}</p>}
                                    <div className="mt-2 flex items-center gap-2">
                                      <Badge variant={file.fileType === 'VIDEO' ? 'blue' : 'slate'}>
                                        {file.fileType === 'VIDEO' ? 'Video' : 'PDF'}
                                      </Badge>
                                      <span className="text-xs text-slate-500">Folder: {selectedFolder ? currentFolder?.name : 'Root'}</span>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button variant="ghost" onClick={() => openEditFile(file)}>
                                      Edit
                                    </Button>
                                    <Button variant="danger" onClick={() => handleDeleteFile(file.id)}>
                                      Delete
                                    </Button>
                                  </div>
                                </motion.div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              )}
            </Card>
          </div>
        </>
      )}

      {view === 'users' && (
        <div className="space-y-6">
          <Card className="bg-white/90">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Change Password</p>
            <form className="mt-3 grid gap-3 md:grid-cols-3" onSubmit={handleChangePassword}>
              <input
                className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-midnight focus:border-blue-400 focus:outline-none"
                placeholder="Old password"
                type="password"
                value={pwdOld}
                onChange={(e) => setPwdOld(e.target.value)}
                required
              />
              <input
                className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-midnight focus:border-blue-400 focus:outline-none"
                placeholder="New password"
                type="password"
                value={pwdNew}
                onChange={(e) => setPwdNew(e.target.value)}
                required
              />
              <Button type="submit">Update password</Button>
            </form>
          </Card>
          <Card className="bg-white/90">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Add user</p>
            <form className="mt-3 grid gap-3 md:grid-cols-4" onSubmit={handleCreateUser}>
              <input
                className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-midnight focus:border-blue-400 focus:outline-none"
                placeholder="Name"
                value={userForm.name}
                onChange={(e) => setUserForm((p) => ({ ...p, name: e.target.value }))}
                required
              />
              <input
                className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-midnight focus:border-blue-400 focus:outline-none"
                placeholder="Email"
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm((p) => ({ ...p, email: e.target.value }))}
                required
              />
              <input
                className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-midnight focus:border-blue-400 focus:outline-none"
                placeholder="Password"
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm((p) => ({ ...p, password: e.target.value }))}
                required
              />
              <select
                className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-midnight focus:border-blue-400 focus:outline-none"
                value={userForm.role}
                onChange={(e) => setUserForm((p) => ({ ...p, role: e.target.value as 'USER' | 'ADMIN' }))}
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              <Button type="submit" className="md:col-span-4">
                Create user
              </Button>
            </form>
          </Card>

          <Card className="bg-white/90">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Users</p>
            <div className="mt-3 space-y-2">
              {users.length === 0 && <p className="text-sm text-slate-500">No users yet.</p>}
              {users.map((u) => (
                <div key={u.id} className="flex flex-wrap items-center justify-between rounded-xl border border-slate-100 bg-white/80 px-3 py-2">
                  <div>
                    <p className="text-sm font-semibold text-midnight">
                      {u.name} <span className="text-xs text-slate-500">({u.role})</span>
                    </p>
                    <p className="text-xs text-slate-500">{u.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => viewUserStats(u)}>
                      Stats
                    </Button>
                    <Button variant="ghost" onClick={() => toggleApproval(u)}>
                      {u.isApproved ? 'Revoke' : 'Approve'}
                    </Button>
                    <Button variant="ghost" onClick={() => deactivateUser(u)}>
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button variant="danger" onClick={() => removeUser(u)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {selectedUserStats && (
              <div className="mt-4 rounded-xl border border-slate-100 bg-white/70 p-3 text-sm text-midnight">
                <p className="font-semibold">User progress</p>
                <p>Completed files: {selectedUserStats.progress}</p>
                <p>Bookmarks: {selectedUserStats.bookmarks}</p>
                <p>Progress: {selectedUserStats.percent}%</p>
              </div>
            )}
            <div className="mt-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Overall progress</p>
              <div className="mt-2 space-y-2">
                {progressSummary.map((s) => (
                  <div key={s.id} className="rounded-xl border border-slate-100 bg-white/70 p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{s.name}</span>
                      <span className="text-xs text-slate-500">{s.email}</span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-blue-500" style={{ width: `${s.percent}%` }} />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {s.completed} completed · {s.bookmarks} bookmarked · {s.percent}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {view === 'mcq' && (
        <div className="space-y-6">
          <Card className="bg-white/90">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Add MCQ</p>
            <form
              className="mt-3 grid gap-3 md:grid-cols-2"
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await adminCreateMcq(mcqForm);
                  setMcqForm({ ...mcqForm, question: '', optionA: '', optionB: '', optionC: '', optionD: '', explanation: '' });
                  await loadMcq();
                  alert('Question added');
                } catch (err: any) {
                  setError(err.message || 'Failed to add question');
                }
              }}
            >
              <textarea
                className="md:col-span-2 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-midnight focus:border-blue-400 focus:outline-none"
                placeholder="Question"
                value={mcqForm.question}
                onChange={(e) => setMcqForm((p) => ({ ...p, question: e.target.value }))}
                required
              />
              {(['optionA', 'optionB', 'optionC', 'optionD'] as const).map((field, idx) => (
                <input
                  key={field}
                  className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-midnight focus:border-blue-400 focus:outline-none"
                  placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                  value={mcqForm[field]}
                  onChange={(e) => setMcqForm((p) => ({ ...p, [field]: e.target.value }))}
                  required
                />
              ))}
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-midnight">Correct</label>
                <select
                  className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-midnight focus:border-blue-400 focus:outline-none"
                  value={mcqForm.correctOption}
                  onChange={(e) => setMcqForm((p) => ({ ...p, correctOption: e.target.value as 'A' | 'B' | 'C' | 'D' }))}
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>
              <textarea
                className="md:col-span-2 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-midnight focus:border-blue-400 focus:outline-none"
                placeholder="Explanation (optional)"
                value={mcqForm.explanation}
                onChange={(e) => setMcqForm((p) => ({ ...p, explanation: e.target.value }))}
              />
              <Button type="submit" className="md:col-span-2">
                Save question
              </Button>
            </form>
          </Card>
          <Card className="bg-white/90">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Question Bank</p>
                <h3 className="text-xl font-semibold text-midnight">Recent questions</h3>
              </div>
              <Button variant="ghost" onClick={loadMcq}>
                Refresh
              </Button>
            </div>
            <div className="mt-3 space-y-3">
              {mcqList.length === 0 && <p className="text-sm text-slate-500">No questions yet.</p>}
              {mcqList.map((q) => (
                <div key={q.id} className="rounded-2xl border border-slate-100 bg-white/80 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-midnight">{q.question}</p>
                      <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-600">
                        <li>A. {q.optionA}</li>
                        <li>B. {q.optionB}</li>
                        <li>C. {q.optionC}</li>
                        <li>D. {q.optionD}</li>
                      </ul>
                      <p className="mt-2 text-xs text-emerald-600">Correct: {q.correctOption}</p>
                      {q.explanation && <p className="text-xs text-slate-500">Explanation: {q.explanation}</p>}
                    </div>
                    <Button
                      variant="ghost"
                      onClick={async () => {
                        if (!confirm('Delete this question?')) return;
                        try {
                          await adminDeleteMcq(q.id);
                          await loadMcq();
                        } catch (err: any) {
                          setError(err.message || 'Delete failed');
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      <Modal open={folderModalOpen} title={editingFolderId ? 'Edit Folder' : 'Add Folder'} onClose={() => setFolderModalOpen(false)}>
        <form className="space-y-4" onSubmit={submitFolder}>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-midnight">Name</label>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-midnight shadow-inner focus:border-blue-400 focus:outline-none"
              value={folderForm.name}
              onChange={(e) => setFolderForm((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-midnight">Description</label>
            <textarea
              className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-midnight shadow-inner focus:border-blue-400 focus:outline-none"
              value={folderForm.description}
              onChange={(e) => setFolderForm((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>
          <Button type="submit">{editingFolderId ? 'Update' : 'Create'} Folder</Button>
        </form>
      </Modal>

      <Modal open={fileModalOpen} title={editingFileId ? 'Edit File' : 'Add File'} onClose={() => setFileModalOpen(false)}>
        <form className="space-y-4" onSubmit={submitFile}>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-midnight">Name</label>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-midnight shadow-inner focus:border-blue-400 focus:outline-none"
              value={fileForm.name}
              onChange={(e) => setFileForm((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-midnight">Description</label>
            <textarea
              className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-midnight shadow-inner focus:border-blue-400 focus:outline-none"
              value={fileForm.description}
              onChange={(e) => setFileForm((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-midnight">File Type</label>
            <select
              className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-midnight shadow-inner focus:border-blue-400 focus:outline-none"
              value={fileForm.fileType}
              onChange={(e) => setFileForm((prev) => ({ ...prev, fileType: e.target.value as 'VIDEO' | 'PDF' }))}
            >
              <option value="VIDEO">Video</option>
              <option value="PDF">PDF</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-midnight">Google Drive URL</label>
            <input
              className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-midnight shadow-inner focus:border-blue-400 focus:outline-none"
              value={fileForm.googleDriveUrl}
              onChange={(e) => setFileForm((prev) => ({ ...prev, googleDriveUrl: e.target.value }))}
              required
              placeholder="https://drive.google.com/..."
            />
          </div>
          <Button type="submit">{editingFileId ? 'Update' : 'Create'} File</Button>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default AdminDashboardPage;
