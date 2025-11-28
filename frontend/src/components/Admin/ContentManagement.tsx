import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { Spinner } from '../UI/Spinner';
import { TreeView } from '../UI/TreeView';
import { Badge } from '../UI/Badge';
import { Modal } from '../UI/Modal';
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
} from '../../services/contentApi';
import { SyllabusNode, fetchSyllabusTree, updateSyllabusSection } from '../../services/syllabusApi';

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

export const ContentManagement: React.FC = () => {
  const [tree, setTree] = useState<FolderNode[]>([]);
  const [rootFiles, setRootFiles] = useState<FileItem[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [announcementText, setAnnouncementText] = useState('');
  const [syllabusTree, setSyllabusTree] = useState<SyllabusNode[]>([]);
  const [syllabusLoading, setSyllabusLoading] = useState(false);
  const [linkingSectionId, setLinkingSectionId] = useState<string>('');

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
  
  useEffect(() => {
    loadContent();
    loadSyllabus();
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

  return (
    <>
      <div className="mb-6 grid gap-6 md:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-[0.22em] text-secondary">Overview</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Content tree</h3>
          <p className="text-sm text-slate-300">Manage nested folders, ordering, and links.</p>
        </Card>
        <Card className="bg-gradient-to-br from-primary/90 to-secondary/80 text-white">
          <p className="text-xs uppercase tracking-[0.22em] text-white/80">Status</p>
          <h3 className="mt-2 text-xl font-semibold">Ordering</h3>
          <p className="text-sm text-white/80">Drag to reorder folders/files. Order is respected over names.</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.22em] text-secondary">AI MCQ Feature</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Gemini API Integration</h3>
          <p className="text-sm text-slate-300">
            AI-powered MCQ generation is enabled. Configure `GEMINI_API_KEY` in the backend's `.env` file for functionality.
          </p>
        </Card>
      </div>

      <Card className="mb-6">
        <p className="text-xs uppercase tracking-[0.22em] text-secondary">Message to users</p>
        <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-center">
          <input
            className="glass flex-1 rounded-xl border-transparent bg-black/20 px-3 py-2 text-white shadow-inner focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Announcement text"
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
          />
          <Button onClick={submitAnnouncement}>Send</Button>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Folder Tree</h3>
          </div>
          {loading ? <Spinner /> : <TreeView tree={tree} selectedId={selectedFolder} onSelect={(id) => setSelectedFolder(id)} />}
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

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-secondary">Files</p>
              <h3 className="text-xl font-semibold text-white">{selectedFolder ? currentFolder?.name : 'Root Files'}</h3>
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
                      <p className="text-xs font-semibold text-slate-400">Sub-folders</p>
                      {folderChildren.map((folder, idx) => (
                        <Draggable key={folder.id} draggableId={folder.id} index={idx}>
                          {(drag) => (
                            <div
                              ref={drag.innerRef}
                              {...drag.draggableProps}
                              {...drag.dragHandleProps}
                              className="glass flex items-center justify-between rounded-xl px-3 py-2"
                            >
                              <span className="text-slate-200">{folder.name}</span>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <div className="mt-4 space-y-2 rounded-2xl bg-black/20 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-300">Syllabus mapping</p>
                    <Button variant="ghost" onClick={loadSyllabus} disabled={syllabusLoading}>
                      Refresh
                    </Button>
                  </div>
                  {linkedSections.length === 0 && <p className="text-sm text-slate-400">No syllabus linked to this folder.</p>}
                  {linkedSections.map((s) => (
                    <div key={s.id} className="glass flex items-center justify-between rounded-xl px-3 py-2 text-sm">
                      <span className="text-slate-300">{s.title}</span>
                      <Button variant="ghost" onClick={() => handleUnlinkSection(s.id)}>
                        Unlink
                      </Button>
                    </div>
                  ))}
                  <div className="glass flex flex-col gap-2 rounded-xl p-3">
                    <select
                      value={linkingSectionId}
                      onChange={(e) => setLinkingSectionId(e.target.value)}
                      className="glass w-full rounded-xl border-transparent bg-black/20 px-3 py-2 text-white shadow-inner focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary"
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
                      <p className="text-xs font-semibold text-slate-400">Files</p>
                      {filesToShow.map((file, idx) => (
                        <Draggable key={file.id} draggableId={file.id} index={idx}>
                          {(drag) => (
                            <motion.div
                              ref={drag.innerRef}
                              {...drag.draggableProps}
                              {...drag.dragHandleProps}
                              className="glass flex items-center justify-between rounded-2xl p-4"
                              initial={{ opacity: 0.9 }}
                              animate={{ opacity: 1 }}
                            >
                              <div>
                                <h4 className="text-lg font-semibold text-white">{file.name}</h4>
                                {file.description && <p className="text-sm text-slate-300">{file.description}</p>}
                                <div className="mt-2 flex items-center gap-2">
                                  <Badge variant={file.fileType === 'VIDEO' ? 'blue' : 'slate'}>
                                    {file.fileType === 'VIDEO' ? 'Video' : 'PDF'}
                                  </Badge>
                                  <span className="text-xs text-slate-400">Folder: {selectedFolder ? currentFolder?.name : 'Root'}</span>
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
      <Modal open={folderModalOpen} title={editingFolderId ? 'Edit Folder' : 'Add Folder'} onClose={() => setFolderModalOpen(false)}>
        <form className="space-y-4" onSubmit={submitFolder}>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">Name</label>
            <input
              className="glass w-full rounded-xl border-transparent bg-black/20 px-3 py-2 text-white shadow-inner focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary"
              value={folderForm.name}
              onChange={(e) => setFolderForm((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">Description</label>
            <textarea
              className="glass w-full rounded-xl border-transparent bg-black/20 px-3 py-2 text-white shadow-inner focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary"
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
            <label className="text-sm font-semibold text-slate-300">Name</label>
            <input
              className="glass w-full rounded-xl border-transparent bg-black/20 px-3 py-2 text-white shadow-inner focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary"
              value={fileForm.name}
              onChange={(e) => setFileForm((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">Description</label>
            <textarea
              className="glass w-full rounded-xl border-transparent bg-black/20 px-3 py-2 text-white shadow-inner focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary"
              value={fileForm.description}
              onChange={(e) => setFileForm((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">File Type</label>
            <select
              className="glass w-full rounded-xl border-transparent bg-black/20 px-3 py-2 text-white shadow-inner focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary"
              value={fileForm.fileType}
              onChange={(e) => setFileForm((prev) => ({ ...prev, fileType: e.target.value as 'VIDEO' | 'PDF' }))}
            >
              <option value="VIDEO">Video</option>
              <option value="PDF">PDF</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">Google Drive URL</label>
            <input
              className="glass w-full rounded-xl border-transparent bg-black/20 px-3 py-2 text-white shadow-inner focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary"
              value={fileForm.googleDriveUrl}
              onChange={(e) => setFileForm((prev) => ({ ...prev, googleDriveUrl: e.target.value }))}
              required
              placeholder="https://drive.google.com/..."
            />
          </div>
          <Button type="submit">{editingFileId ? 'Update' : 'Create'} File</Button>
        </form>
      </Modal>
    </>
  );
};
