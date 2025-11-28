import React, { useState } from 'react';
import { DashboardLayout } from '../components/Layout/DashboardLayout';
import { Button } from '../components/UI/Button';
import { ContentManagement } from '../components/Admin/ContentManagement';
import { UserManagement } from '../components/Admin/UserManagement';
import { MCQManagement } from '../components/Admin/MCQManagement';
import AdminFilesPage from './AdminFilesPage';

type View = 'content' | 'users' | 'mcq' | 'all-files';

const AdminDashboardPage: React.FC = () => {
  const [view, setView] = useState<View>('content');

  const renderView = () => {
    switch (view) {
      case 'content':
        return <ContentManagement />;
      case 'users':
        return <UserManagement />;
      case 'mcq':
        return <MCQManagement />;
      case 'all-files':
        return <AdminFilesPage />;
      default:
        return <ContentManagement />;
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
        <Button variant={view === 'mcq' ? 'primary' : 'ghost'} onClick={() => setView('mcq')}>
          MCQ Bank
        </Button>
        <Button variant={view === 'all-files' ? 'primary' : 'ghost'} onClick={() => setView('all-files')}>
          All Files
        </Button>
      </div>

      {renderView()}
    </DashboardLayout>
  );
};

export default AdminDashboardPage;