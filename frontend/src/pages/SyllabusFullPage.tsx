import React from 'react';
import { DashboardLayout } from '../components/Layout/DashboardLayout';
import { Button } from '../components/UI/Button';
import { SyllabusView } from '../components/Syllabus/SyllabusView';
import { useNavigate } from 'react-router-dom';

const SyllabusFullPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout title="Full Syllabus">
      <div className="mb-4">
        <Button variant="ghost" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </Button>
      </div>
      <SyllabusView view="full" />
    </DashboardLayout>
  );
};

export default SyllabusFullPage;