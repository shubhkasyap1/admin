'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

type Props = {
  onClose: () => void;
  onSuccess: () => void;
  existing?: {
    _id: string;
    personName: string;
    quote: string;
    designation: string;
    image: string;
  };
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function SuccessStoryForm({ onClose, onSuccess, existing }: Props) {
  const [formData, setFormData] = useState({
    personName: existing?.personName || '',
    quote: existing?.quote || '',
    designation: existing?.designation || '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(existing?.image || null);
  const [loading, setLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const isEdit = Boolean(existing);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  const submitForm = async () => {
    if (!token) {
      toast.error('Unauthorized. Please login again.');
      return;
    }

    const payload = new FormData();
    payload.append('personName', formData.personName);
    payload.append('quote', formData.quote);
    payload.append('designation', formData.designation);
    if (imageFile) {
      payload.append('image', imageFile);
    }

    setLoading(true);
    try {
      const endpoint = isEdit ? `/success-stories/${existing?._id}` : `/success-stories`;

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      const data = await res.json();

      if (data.success) {
        toast.success(`✅ Success story ${isEdit ? 'updated' : 'created'}!`);
        onSuccess();
        onClose();
      } else {
        toast.error(data.message || 'Something went wrong.');
      }
    } catch (err) {
      console.error(err);
      toast.error('❌ Server error, please try again.');
    } finally {
      setLoading(false);
      setShowConfirmDialog(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      setShowConfirmDialog(true);
    } else {
      submitForm();
    }
  };

  return (
    <>
      <div className="rounded-xl p-6 border shadow-md bg-white dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4">
          {isEdit ? '✏️ Edit Success Story' : '➕ Create Success Story'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="personName"
            placeholder="Person Name"
            value={formData.personName}
            onChange={handleChange}
            className="w-full border p-2 rounded bg-transparent dark:border-gray-600"
            required
          />
          <input
            type="text"
            name="designation"
            placeholder="Designation"
            value={formData.designation}
            onChange={handleChange}
            className="w-full border p-2 rounded bg-transparent dark:border-gray-600"
            required
          />
          <textarea
            name="quote"
            placeholder="Quote / YouTube Link"
            value={formData.quote}
            onChange={handleChange}
            rows={3}
            className="w-full border p-2 rounded bg-transparent dark:border-gray-600"
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border p-2 rounded bg-transparent dark:border-gray-600"
            required={!isEdit}
          />

          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-48 object-cover rounded border border-gray-300 dark:border-gray-600"
            />
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
            >
              {loading ? (isEdit ? 'Updating...' : 'Creating...') : isEdit ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white py-2 px-6 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {isEdit && (
        <ConfirmDialog
          open={showConfirmDialog}
          onCancel={() => setShowConfirmDialog(false)}
          onConfirm={submitForm}
          title="Update Success Story?"
          description="Are you sure you want to apply these changes?"
          confirmText="Yes, Update"
          cancelText="Cancel"
        />
      )}
    </>
  );
}
