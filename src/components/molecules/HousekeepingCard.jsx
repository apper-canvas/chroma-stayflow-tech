import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';

const HousekeepingCard = ({ 
  task, 
  onUpdateStatus, 
  onViewDetails, 
  className = '' 
}) => {
  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'in-progress': return 'info';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  const getTaskTypeIcon = (type) => {
    switch (type) {
      case 'checkout-cleaning': return 'LogOut';
      case 'maintenance-cleaning': return 'Wrench';
      case 'daily-service': return 'Calendar';
      case 'pre-arrival': return 'LogIn';
      default: return 'ClipboardList';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name={getTaskTypeIcon(task.type)} size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-surface-900">
                Room {task.roomId}
              </h3>
              <p className="text-sm text-surface-600 capitalize">
                {task.type.replace('-', ' ')}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Badge variant={getPriorityVariant(task.priority)} size="sm">
              {task.priority.toUpperCase()}
            </Badge>
            <Badge variant={getStatusVariant(task.status)} size="sm">
              {task.status.replace('-', ' ').toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-surface-500 uppercase tracking-wide font-medium mb-1">
              Assigned To
            </p>
            <p className="text-sm font-medium text-surface-900">
              {task.assignedTo}
            </p>
          </div>
          <div>
            <p className="text-xs text-surface-500 uppercase tracking-wide font-medium mb-1">
              Scheduled Time
            </p>
            <p className="text-sm font-medium text-surface-900">
              {format(new Date(task.scheduledTime), 'h:mm a')}
            </p>
            <p className="text-xs text-surface-600">
              {format(new Date(task.scheduledTime), 'MMM dd, yyyy')}
            </p>
          </div>
        </div>

        {task.completedTime && (
          <div className="mb-4 p-3 bg-success/10 rounded-lg border border-success/20">
            <div className="flex items-center">
              <ApperIcon name="CheckCircle" size={16} className="text-success mr-2" />
              <span className="text-sm text-success font-medium">
                Completed at {format(new Date(task.completedTime), 'h:mm a')}
              </span>
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          {task.status === 'pending' && (
            <Button
              size="sm"
              variant="primary"
              icon="Play"
              onClick={() => onUpdateStatus?.(task.id, 'in-progress')}
              className="flex-1"
            >
              Start Task
            </Button>
          )}
          {task.status === 'in-progress' && (
            <Button
              size="sm"
              variant="success"
              icon="CheckCircle"
              onClick={() => onUpdateStatus?.(task.id, 'completed')}
              className="flex-1"
            >
              Complete
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            icon="Eye"
            onClick={() => onViewDetails?.(task)}
          >
            Details
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default HousekeepingCard;