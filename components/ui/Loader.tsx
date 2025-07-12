'use client';

import { motion } from 'framer-motion';
import clsx from 'clsx';

type LoaderType = 'dashboard' | 'list' | 'card' | 'form';

interface LoaderProps {
  type?: LoaderType;
}

const shimmer =
  'animate-pulse bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800';

export default function Loader({ type = 'dashboard' }: LoaderProps) {
  return (
    <motion.div
      className="p-6 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {type === 'dashboard' && (
        <div className="grid gap-4">
          {/* Top Bar */}
          <div className={clsx('h-10 rounded-lg', shimmer)} />
          {/* Sidebar & Content */}
          <div className="grid grid-cols-5 gap-4">
            <div className="space-y-2 col-span-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={clsx('h-6 rounded-md', shimmer)} />
              ))}
            </div>
            <div className="col-span-4 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className={clsx('h-16 rounded-lg', shimmer)} />
              ))}
            </div>
          </div>
        </div>
      )}

      {type === 'list' && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={clsx('h-14 rounded-md', shimmer)} />
          ))}
        </div>
      )}

      {type === 'card' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={clsx('h-48 w-full rounded-xl', shimmer)} />
          ))}
        </div>
      )}

      {type === 'form' && (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={clsx('h-10 rounded', shimmer)} />
          ))}
          <div className={clsx('h-12 w-1/2 rounded-lg', shimmer)} />
        </div>
      )}
    </motion.div>
  );
}
