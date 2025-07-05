'use client';

import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { cn } from '@/lib/utils';

interface ConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  title = 'Are you absolutely sure?',
  description = 'This action cannot be undone.',
  confirmText = 'Yes, Confirm',
  cancelText = 'Cancel',
}: ConfirmDialogProps) {
  return (
    <AlertDialog.Root open={open}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <AlertDialog.Content
          className={cn(
            'fixed z-50 left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border',
            'bg-white p-6 shadow-xl dark:bg-gray-900 dark:border-gray-700'
          )}
        >
          <AlertDialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className="text-sm mt-2 text-gray-700 dark:text-gray-300">
            {description}
          </AlertDialog.Description>

          <div className="mt-6 flex justify-end gap-4">
            <AlertDialog.Cancel asChild>
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              >
                {cancelText}
              </button>
            </AlertDialog.Cancel>

            <AlertDialog.Action asChild>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                {confirmText}
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
