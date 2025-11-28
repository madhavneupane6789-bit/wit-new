import React from 'react';
import { AuthLayout } from '../components/Layout/AuthLayout';

const AccountPendingPage: React.FC = () => {
  return (
    <AuthLayout
      title="Account Pending Activation"
      subtitle="Your account is awaiting approval from an administrator. Please check back later."
    >
      <div className="text-center text-white">
        <p className="text-lg mb-4">Thank you for registering!</p>
        <p>
          We've received your registration and an administrator will review your account shortly.
          You'll be able to access all features once your account is activated.
        </p>
      </div>
    </AuthLayout>
  );
};

export default AccountPendingPage;
