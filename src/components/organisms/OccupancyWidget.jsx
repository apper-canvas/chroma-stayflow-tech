import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const OccupancyWidget = ({ 
  totalRooms = 0, 
  occupiedRooms = 0, 
  availableRooms = 0,
  className = '' 
}) => {
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (circumference * occupancyRate) / 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-surface rounded-lg p-6 shadow-sm border border-surface-200 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-surface-900">
          Room Occupancy
        </h3>
        <ApperIcon name="PieChart" size={20} className="text-primary" />
      </div>

      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg
            className="w-32 h-32 transform -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#e2e8f0"
              strokeWidth="8"
              fill="transparent"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke="#1e3a5f"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <motion.p
                className="text-2xl font-bold text-primary"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1 }}
              >
                {occupancyRate}%
              </motion.p>
              <p className="text-xs text-surface-600">Occupied</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <motion.p
            className="text-xl font-bold text-surface-900"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {totalRooms}
          </motion.p>
          <p className="text-xs text-surface-600">Total</p>
        </div>
        <div>
          <motion.p
            className="text-xl font-bold text-info"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {occupiedRooms}
          </motion.p>
          <p className="text-xs text-surface-600">Occupied</p>
        </div>
        <div>
          <motion.p
            className="text-xl font-bold text-success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {availableRooms}
          </motion.p>
          <p className="text-xs text-surface-600">Available</p>
        </div>
      </div>
    </motion.div>
  );
};

export default OccupancyWidget;