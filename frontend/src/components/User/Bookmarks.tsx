import React from 'react';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { FileItem } from '../../services/contentApi';
import { useAuth } from '../../hooks/useAuth';

interface BookmarksProps {
  bookmarks: FileItem[];
  toggleBookmark: (file: FileItem) => Promise<void>;
  toggleCompleted: (file: FileItem) => Promise<void>;
  handleOpen: (file: FileItem) => Promise<void>;
}

export const Bookmarks: React.FC<BookmarksProps> = ({ bookmarks, toggleBookmark, toggleCompleted, handleOpen }) => {
  const { user } = useAuth();
  return (
    <div className="mt-6">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-secondary">Bookmarks</p>
            <h3 className="text-xl font-semibold text-white">Saved files</h3>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {bookmarks.length === 0 && <p className="text-sm text-slate-400">No bookmarks yet.</p>}
          {bookmarks.map((file) => (
            <div
              key={file.id}
              className="glass flex items-center justify-between rounded-2xl p-4 transition-all hover:bg-white/5"
            >
              <div>
                <h4 className="font-semibold text-white">{file.name}</h4>
                <p className="text-xs text-slate-400">{file.fileType}</p>
                {file.lastOpenedAt && <p className="text-xs text-slate-400">Last opened: {new Date(file.lastOpenedAt).toLocaleString()}</p>}
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
  );
};
