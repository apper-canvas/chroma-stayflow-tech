import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = ({ count = 3, type = 'card', className = '' }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="bg-surface rounded-lg p-6 shadow-sm border border-surface-200">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-surface-200 rounded w-3/4"></div>
              <div className="h-4 bg-surface-200 rounded w-1/2"></div>
              <div className="h-8 bg-surface-200 rounded w-1/4"></div>
            </div>
          </div>
        );
      case 'table':
        return (
          <div className="bg-surface rounded-lg border border-surface-200">
            <div className="animate-pulse p-6 space-y-4">
              <div className="h-4 bg-surface-200 rounded w-full"></div>
              <div className="h-4 bg-surface-200 rounded w-5/6"></div>
              <div className="h-4 bg-surface-200 rounded w-4/6"></div>
            </div>
          </div>
        );
      case 'room':
        return (
          <div className="bg-surface rounded-lg p-4 shadow-sm border border-surface-200">
            <div className="animate-pulse space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-6 bg-surface-200 rounded w-16"></div>
                <div className="h-5 bg-surface-200 rounded-full w-20"></div>
              </div>
              <div className="h-4 bg-surface-200 rounded w-3/4"></div>
              <div className="h-8 bg-surface-200 rounded w-full"></div>
            </div>
          </div>
        );
      default:
        return (
          <div className="animate-pulse">
            <div className="h-4 bg-surface-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-surface-200 rounded w-3/4"></div>
          </div>
        );
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          {renderSkeleton()}
        </motion.div>
      ))}
    </div>
  );
};

export default SkeletonLoader;