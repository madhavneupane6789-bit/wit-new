import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '../components/Layout/DashboardLayout';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
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
import { Link } from 'react-router-dom';
import { Library } from '../components/User/Library';
import { Bookmarks } from '../components/User/Bookmarks';
import { Completed } from '../components/User/Completed';
import { Syllabus } from '../components/User/Syllabus';

const extractDriveId = (url: string): string | null => {
  const matchPath = url.match(/\/d\/([^/]+)/);
  if (matchPath && matchPath[1]) return matchPath[1];
  const query = url.includes('?') ? url.split('?')[1] : '';
  const params = new URLSearchParams(query);
  const qId = params.get('id');
  if (qId) return qId;
  return null;
};

const UserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [tree, setTree] = useState<FolderNode[]>([]);
  const [rootFiles, setRootFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const [progress, setProgressValue] = useState<number>(0);
  const [now, setNow] = useState<string>(new Date().toLocaleString());
  const [pwdOld, setPwdOld] = useState('');
  const [pwdNew, setPwdNew] = useState('');
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'library' | 'bookmarks' | 'read' | 'syllabus'>('library');
  const [playerFile, setPlayerFile] = useState<{ id: string; name: string; src: string } | null>(null);
  const [requestMessage, setRequestMessage] = useState('');

  const load = useCallback(async () => {
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
  }, []);

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
    const t = setInterval(() => setNow(new Date().toLocaleString()), 1000);
    return () => clearInterval(t);
  }, [load]);

  const viewSyllabus = (sectionId: string) => {
    // This function will be passed to the Library component
    // For now, it will just switch the tab
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
      await uploadAvatar(file);
      await load();
      alert('Avatar updated');
    } catch (err: any) {
      setError(err.message || 'Avatar upload failed');
    } finally {
      setUploading(false);
    }
  };
  
  const renderView = () => {
    switch (activeTab) {
      case 'library':
        return <Library viewSyllabus={viewSyllabus} setPlayerFile={setPlayerFile} />;
      case 'bookmarks':
        return <Bookmarks bookmarks={bookmarks} toggleBookmark={toggleBookmark} toggleCompleted={toggleCompleted} handleOpen={handleOpen} />;
      case 'read':
        return <Completed allFiles={allFiles} toggleCompleted={toggleCompleted} handleOpen={handleOpen} />;
      case 'syllabus':
        return <Syllabus />;
      default:
        return <Library viewSyllabus={viewSyllabus} setPlayerFile={setPlayerFile} />;
    }
  }

  return (
    <DashboardLayout title="Dashboard">
      <div className="mb-4 flex flex-wrap items-center gap-2">
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
        <div className="ml-auto text-sm text-slate-400">Local time: {now}</div>
      </div>

      <div className="mb-6 grid gap-6 md:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-[0.22em] text-secondary">Welcome</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Hello, {user?.name}</h3>
          <p className="text-sm text-slate-300">Browse your library and jump into resources quickly.</p>
          <div className="mt-3 flex items-center gap-3">
            {user?.avatarUrl && <img src={user.avatarUrl} alt="avatar" className="h-12 w-12 rounded-full object-cover" />}
            <label className="cursor-pointer text-xs text-primary hover:underline">
              {uploading ? 'Uploading...' : 'Change photo'}
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
            </label>
          </div>
          <div className="mt-4">
            <div className="h-3 w-full overflow-hidden rounded-full bg-black/20">
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${overallProgress}%` }} />
            </div>
            <p className="mt-1 text-xs text-slate-400">{overallProgress}% completed</p>
          </div>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.22em] text-secondary">Feedback</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Message admin</h3>
          <p className="text-sm text-slate-300">
            Share issues or requests with the admin team. Keep your account details handy for quick follow-up.
          </p>
          <div className="mt-3 space-y-2 rounded-xl bg-black/20 p-3">
            <textarea
              className="glass w-full rounded-lg border-transparent bg-black/20 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Type your message..."
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              rows={3}
            />
            <Button
              variant="primary"
              onClick={() => {
                if (!requestMessage.trim()) return;
                alert('Request sent to admin.');
                setRequestMessage('');
              }}
            >
              Send request
            </Button>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-secondary">Content</p>
              <h3 className="mt-2 text-xl font-semibold text-white">Library</h3>
            </div>
            <Button variant="ghost" onClick={load}>
              Refresh
            </Button>
          </div>
          <p className="text-sm text-slate-300">Updated tree with nested folders and quick links.</p>
        </Card>
      </div>

      {announcement && (
        <Card className="mb-6">
          <p className="text-xs uppercase tracking-[0.22em] text-secondary">Message from admin</p>
          <p className="mt-2 text-white">{announcement}</p>
        </Card>
      )}

      {user?.status === 'PENDING' && (
        <Card className="mb-6 border-amber-500/50 bg-amber-500/10">
          <p className="text-sm font-semibold text-amber-300">Account Pending Activation</p>
          <p className="text-sm text-amber-400">Your account is awaiting approval from an administrator. All content is temporarily locked.</p>
        </Card>
      )}
      {user?.status !== 'PENDING' ? (
        <>
          {renderView()}

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card>
              <p className="text-xs uppercase tracking-[0.22em] text-secondary">Change Password</p>
              <form className="mt-3 space-y-3" onSubmit={handleChangePassword}>
                <input
                  className="glass w-full rounded-xl border-transparent bg-black/20 px-3 py-2 text-white shadow-inner focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Old password"
                  type="password"
                  value={pwdOld}
                  onChange={(e) => setPwdOld(e.target.value)}
                  required
                />
                <input
                  className="glass w-full rounded-xl border-transparent bg-black/20 px-3 py-2 text-white shadow-inner focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary"
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
        </>
      ) : (
        <Card className="mb-6 border-slate-500/50 bg-slate-500/10 text-center">
          <p className="text-sm font-semibold text-slate-300">Content and features are unavailable until your account is activated.</p>
        </Card>
      )}

      {playerFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
          <div className="glass w-full max-w-4xl rounded-2xl p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-secondary">Now playing</p>
                <h3 className="text-lg font-semibold text-white">{playerFile.name}</h3>
              </div>
              <Button variant="ghost" onClick={() => setPlayerFile(null)}>
                Close
              </Button>
            </div>
            <div className="overflow-hidden rounded-xl border border-white/10 bg-black">
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