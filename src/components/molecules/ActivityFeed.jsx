import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';

const ActivityFeed = ({ activities = [], className = '' }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'check-in': return 'LogIn';
      case 'check-out': return 'LogOut';
      case 'cleaning': return 'Sparkles';
      case 'maintenance': return 'Wrench';
      case 'reservation': return 'Calendar';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'check-in': return 'text-success';
      case 'check-out': return 'text-info';
      case 'cleaning': return 'text-accent';
      case 'maintenance': return 'text-warning';
      case 'reservation': return 'text-primary';
      default: return 'text-surface-600';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id || index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-start space-x-3"
        >
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-surface-100 ${getActivityColor(activity.type)}`}>
            <ApperIcon name={getActivityIcon(activity.type)} size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-surface-900">
              {activity.title}
            </p>
            <p className="text-sm text-surface-600">
              {activity.description}
            </p>
            <p className="text-xs text-surface-500 mt-1">
              {format(new Date(activity.timestamp), 'h:mm a')}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ActivityFeed;