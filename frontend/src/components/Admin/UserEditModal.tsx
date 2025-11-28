import React, { useState, useEffect } from 'react';
import { Modal } from '../UI/Modal';
import { Button } from '../UI/Button';
import { User } from '../../services/authApi';

interface UserEditModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userId: string, data: Partial<User>) => void;
}

export const UserEditModal: React.FC<UserEditModalProps> = ({ user, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<User>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        status: user.status,
        role: user.role,
        subscriptionStartDate: user.subscriptionStartDate,
        subscriptionEndDate: user.subscriptionEndDate,
        subscriptionStatus: user.subscriptionStatus,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value ? new Date(value).toISOString() : null }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(user.id, formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit User: ${user?.name}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300">Status</label>
          <select
            name="status"
            value={formData.status || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-black/20 text-white"
          >
            <option value="PENDING">PENDING</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300">Role</label>
          <select
            name="role"
            value={formData.role || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-black/20 text-white"
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300">Subscription Start Date</label>
          <input
            type="date"
            name="subscriptionStartDate"
            value={formData.subscriptionStartDate ? new Date(formData.subscriptionStartDate).toISOString().split('T')[0] : ''}
            onChange={handleDateChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-black/20 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300">Subscription End Date</label>
          <input
            type="date"
            name="subscriptionEndDate"
            value={formData.subscriptionEndDate ? new Date(formData.subscriptionEndDate).toISOString().split('T')[0] : ''}
            onChange={handleDateChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-black/20 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300">Subscription Status</label>
          <select
            name="subscriptionStatus"
            value={formData.subscriptionStatus || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 bg-black/20 text-white"
          >
            <option value="FREE">FREE</option>
            <option value="BASIC">BASIC</option>
            <option value="PREMIUM">PREMIUM</option>
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
};