import React, { useState, useEffect, useCallback } from 'react';
import { listAllFiles, updateFile, deleteFile, createFile, File, FileType } from '../services/adminApi';
import { Spinner } from '../components/UI/Spinner';
import { Button } from '../components/UI/Button';
import { Modal } from '../components/UI/Modal';

const AdminFilesPage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editingFile, setEditingFile] = useState<File | null>(null);

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<File | null>(null);
  
  const [formData, setFormData] = useState<Partial<File>>({
    name: '',
    description: '',
    fileType: 'PDF',
    googleDriveUrl: '',
    folderId: undefined,
  });

  const fetchFiles = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedFiles = await listAllFiles();
      setFiles(fetchedFiles);
      setError(null);
    } catch (err) {
      setError('Failed to fetch files.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  // Edit Modal
  const openEditModal = (file: File) => {
    setEditingFile(file);
    setFormData({
      name: file.name,
      description: file.description,
      fileType: file.fileType,
      googleDriveUrl: file.googleDriveUrl,
      folderId: file.folderId,
    });
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingFile(null);
    setEditModalOpen(false);
  };

  const handleUpdateFile = async () => {
    if (!editingFile) return;
    try {
      await updateFile(editingFile.id, {
        name: formData.name,
        description: formData.description || undefined,
        fileType: formData.fileType,
        googleDriveUrl: formData.googleDriveUrl,
      });
      closeEditModal();
      await fetchFiles();
    } catch (saveError) {
      setError('Failed to save file. Please try again.');
      console.error(saveError);
    }
  };

  // Create Modal
  const openCreateModal = () => {
    setFormData({
      name: '',
      description: '',
      fileType: 'PDF',
      googleDriveUrl: '',
      folderId: undefined,
    });
    setCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setCreateModalOpen(false);
  };

  const handleCreateFile = async () => {
    try {
      await createFile({
        name: formData.name || 'new file',
        description: formData.description || undefined,
        fileType: formData.fileType || 'PDF',
        googleDriveUrl: formData.googleDriveUrl || '',
      });
      closeCreateModal();
      await fetchFiles();
    } catch (createError) {
      setError('Failed to create file. Please try again.');
      console.error(createError);
    }
  };
  
  // Delete Modal
  const openDeleteModal = (file: File) => {
    setFileToDelete(file);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setFileToDelete(null);
    setDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!fileToDelete) return;
    try {
      await deleteFile(fileToDelete.id);
      closeDeleteModal();
      await fetchFiles();
    } catch (deleteError) {
      setError('Failed to delete file. Please try again.');
      console.error(deleteError);
      closeDeleteModal();
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  }

  const renderForm = () => (
    <div className="space-y-4 text-white">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} className="glass rounded p-2 w-full text-white bg-dark-end"/>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea name="description" value={formData.description || ''} onChange={handleInputChange} className="glass rounded p-2 w-full text-white bg-dark-end"/>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Type</label>
        <select name="fileType" value={formData.fileType || ''} onChange={handleInputChange} className="glass rounded p-2 w-full text-white bg-dark-end">
          <option value="VIDEO">Video</option>
          <option value="PDF">PDF</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Google Drive URL</label>
        <input type="text" name="googleDriveUrl" value={formData.googleDriveUrl || ''} onChange={handleInputChange} className="glass rounded p-2 w-full text-white bg-dark-end"/>
      </div>
    </div>
  );

  return (
    <>
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Manage Files</h1>
          <Button onClick={openCreateModal}>Create File</Button>
        </div>
        {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-md mb-4">{error}</div>}
        <div className="overflow-x-auto glass rounded-lg shadow-lg">
          <table className="min-w-full text-white">
            <thead className="border-b border-white/20">
              <tr>
                <th className="text-left py-3 px-4 font-semibold">Name</th>
                <th className="text-left py-3 px-4 font-semibold">Type</th>
                <th className="text-left py-3 px-4 font-semibold">Link</th>
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4">{file.name}</td>
                  <td className="py-3 px-4"><span className={`px-2 py-1 text-xs rounded-full ${file.fileType === 'VIDEO' ? 'bg-blue-500/30 text-blue-200' : 'bg-green-500/30 text-green-200'}`}>{file.fileType}</span></td>
                  <td className="py-3 px-4"><a href={file.googleDriveUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View File</a></td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <Button onClick={() => openEditModal(file)} variant="ghost" size="sm" className="mr-2">Edit</Button>
                    <Button onClick={() => openDeleteModal(file)} variant="danger" size="sm">Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal open={isEditModalOpen} title="Edit File" onClose={closeEditModal}>
        {renderForm()}
        <div className="mt-6 flex justify-end gap-4">
          <Button variant="ghost" onClick={closeEditModal}>Cancel</Button>
          <Button onClick={handleUpdateFile}>Save Changes</Button>
        </div>
      </Modal>

      {/* Create Modal */}
      <Modal open={isCreateModalOpen} title="Create File" onClose={closeCreateModal}>
        {renderForm()}
        <div className="mt-6 flex justify-end gap-4">
          <Button variant="ghost" onClick={closeCreateModal}>Cancel</Button>
          <Button onClick={handleCreateFile}>Create</Button>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal open={isDeleteModalOpen} title="Confirm Deletion" onClose={closeDeleteModal}>
        <div className="text-white/80">
          Are you sure you want to delete the file <span className="font-bold">{fileToDelete?.name}</span>? This action cannot be undone.
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <Button variant="ghost" onClick={closeDeleteModal}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Confirm Delete</Button>
        </div>
      </Modal>
    </>
  );
};

export default AdminFilesPage;