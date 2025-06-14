import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';

const ReservationCard = ({ 
  reservation, 
  onCheckIn, 
  onCheckOut, 
  onViewDetails, 
  className = '' 
}) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case 'confirmed': return 'info';
      case 'checked-in': return 'success';
      case 'checked-out': return 'default';
      case 'cancelled': return 'error';
      default: return 'default';
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
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-surface-900 mb-1">
              {reservation.guestName}
            </h3>
            <div className="flex items-center text-sm text-surface-600 space-x-4">
              <span className="flex items-center">
                <ApperIcon name="Mail" size={14} className="mr-1" />
                {reservation.guestEmail}
              </span>
              <span className="flex items-center">
                <ApperIcon name="Phone" size={14} className="mr-1" />
                {reservation.guestPhone}
              </span>
            </div>
          </div>
          <Badge variant={getStatusVariant(reservation.status)}>
            {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-surface-500 uppercase tracking-wide font-medium mb-1">
              Check-in
            </p>
            <p className="text-sm font-medium text-surface-900">
              {format(new Date(reservation.checkIn), 'MMM dd, yyyy')}
            </p>
            <p className="text-xs text-surface-600">
              {format(new Date(reservation.checkIn), 'h:mm a')}
            </p>
          </div>
          <div>
            <p className="text-xs text-surface-500 uppercase tracking-wide font-medium mb-1">
              Check-out
            </p>
            <p className="text-sm font-medium text-surface-900">
              {format(new Date(reservation.checkOut), 'MMM dd, yyyy')}
            </p>
            <p className="text-xs text-surface-600">
              {format(new Date(reservation.checkOut), 'h:mm a')}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-surface-600">
              Room: <span className="font-medium">{reservation.roomId}</span>
            </span>
            <span className="text-lg font-bold text-primary">
              ${reservation.totalAmount}
            </span>
          </div>
        </div>

        {reservation.notes && (
          <div className="mb-4 p-3 bg-surface-50 rounded-lg">
            <p className="text-sm text-surface-700">
              <ApperIcon name="StickyNote" size={14} className="inline mr-1" />
              {reservation.notes}
            </p>
          </div>
        )}

        <div className="flex space-x-2">
          {reservation.status === 'confirmed' && (
            <Button
              size="sm"
              variant="primary"
              icon="LogIn"
              onClick={() => onCheckIn?.(reservation)}
              className="flex-1"
            >
              Check In
            </Button>
          )}
          {reservation.status === 'checked-in' && (
            <Button
              size="sm"
              variant="secondary"
              icon="LogOut"
              onClick={() => onCheckOut?.(reservation)}
              className="flex-1"
            >
              Check Out
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            icon="Eye"
            onClick={() => onViewDetails?.(reservation)}
          >
            Details
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default ReservationCard;