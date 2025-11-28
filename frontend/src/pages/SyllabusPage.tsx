import React from 'react';
import { DashboardLayout } from '../components/Layout/DashboardLayout';
import { Button } from '../components/UI/Button';
import { SyllabusView } from '../components/Syllabus/SyllabusView';
import { useNavigate } from 'react-router-dom';

const SyllabusPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout title="Syllabus">
      <div className="mb-4 flex items-center gap-3">
        <Button variant="primary" onClick={() => navigate('/syllabus/full')}>
          Open full syllabus
        </Button>
        <Button variant="ghost" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
      <SyllabusView view="tree" />
    </DashboardLayout>
  );
};

export default SyllabusPage;