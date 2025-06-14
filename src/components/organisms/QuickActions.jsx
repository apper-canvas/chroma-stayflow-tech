import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';

const QuickActions = ({ onAction, className = '' }) => {
  const actions = [
    {
      id: 'new-reservation',
      label: 'New Reservation',
      icon: 'Plus',
      variant: 'primary'
    },
    {
      id: 'check-in',
      label: 'Quick Check-in',
      icon: 'LogIn',
      variant: 'secondary'
    },
    {
      id: 'housekeeping',
      label: 'Assign Task',
      icon: 'Sparkles',
      variant: 'outline'
    },
    {
      id: 'maintenance',
      label: 'Report Issue',
      icon: 'Wrench',
      variant: 'outline'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-surface rounded-lg p-6 shadow-sm border border-surface-200 ${className}`}
    >
      <h3 className="text-lg font-semibold text-surface-900 mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              variant={action.variant}
              icon={action.icon}
              onClick={() => onAction?.(action.id)}
              className="w-full justify-center"
            >
              {action.label}
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default QuickActions;