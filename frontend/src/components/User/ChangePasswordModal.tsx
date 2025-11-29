import React, { useState } from 'react';
import { Button } from '../UI/Button';
import { Modal } from '../UI/Modal';
import { changePassword as changePasswordApi } from '../../services/authApi';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const ChangePasswordModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [pwdOld, setPwdOld] = useState('');
  const [pwdNew, setPwdNew] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await changePasswordApi({ oldPassword: pwdOld, newPassword: pwdNew });
      setPwdOld('');
      setPwdNew('');
      setSuccess('Password changed successfully!');
    } catch (err: any) {
      setError(err.message || 'Password change failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset state on close
    setPwdOld('');
    setPwdNew('');
    setError(null);
    setSuccess(null);
    setLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Change Password">
      <form className="space-y-4" onSubmit={handleChangePassword}>
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
        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-500">{success}</p>}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={!pwdOld || !pwdNew || loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
