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
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

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
      const endpoint = isEdit
        ? `/success-stories/${existing?._id}`
        : `/success-stories`;

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(`✅ Success story ${isEdit ? 'updated' : 'created'}!`);
        onSuccess();
        onClose();
      } else {
        toast.warning(data.message || '⚠️ Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error(err);
      toast.error('❌ Server error. Please try again later.');
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
            placeholder="Quote"
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
              className={`bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 flex items-center justify-center gap-2 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  {isEdit ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEdit ? 'Update' : 'Create'
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className={`bg-gray-500 text-white py-2 px-6 rounded hover:bg-gray-600 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
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
