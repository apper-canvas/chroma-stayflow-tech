import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';

const RoomCard = ({ room, onStatusChange, onViewDetails, className = '' }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return 'Check';
      case 'occupied': return 'User';
      case 'maintenance': return 'Wrench';
      case 'checkout': return 'LogOut';
      case 'reserved': return 'Clock';
      default: return 'HelpCircle';
    }
  };

  const getCleaningStatusIcon = (status) => {
    switch (status) {
      case 'clean': return 'Sparkles';
      case 'dirty': return 'AlertCircle';
      case 'in-progress': return 'Loader2';
      case 'out-of-order': return 'X';
      default: return 'HelpCircle';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-success';
      case 'occupied': return 'bg-info';
      case 'maintenance': return 'bg-warning';
      case 'checkout': return 'bg-error';
      case 'reserved': return 'bg-secondary';
      default: return 'bg-surface-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={className}
    >
      <Card className="relative" hover onClick={onViewDetails}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-surface-900 mb-1">
              Room {room.number}
            </h3>
            <p className="text-sm text-surface-600">
              {room.type} • Floor {room.floor}
            </p>
          </div>
          <div className={`w-3 h-3 rounded-full ${getStatusColor(room.status)}`} />
        </div>

        <div className="flex items-center justify-between mb-4">
          <Badge variant={room.status} size="sm">
            <ApperIcon name={getStatusIcon(room.status)} size={14} className="mr-1" />
            {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
          </Badge>
          <Badge 
            variant={room.cleaningStatus === 'clean' ? 'success' : 'warning'} 
            size="sm"
          >
            <ApperIcon 
              name={getCleaningStatusIcon(room.cleaningStatus)} 
              size={14} 
              className={`mr-1 ${room.cleaningStatus === 'in-progress' ? 'animate-spin' : ''}`} 
            />
            {room.cleaningStatus.charAt(0).toUpperCase() + room.cleaningStatus.slice(1)}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            ${room.rate}/night
          </span>
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              icon="Settings"
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange?.(room);
              }}
            />
            <Button
              size="sm"
              variant="primary"
              icon="Eye"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails?.(room);
              }}
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default RoomCard;