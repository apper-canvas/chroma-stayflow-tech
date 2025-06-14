import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  changeType = 'neutral',
  trend,
  className = '' 
}) => {
  const changeColors = {
    positive: 'text-success',
    negative: 'text-error',
    neutral: 'text-surface-600'
  };

  return (
    <Card className={`relative overflow-hidden ${className}`} hover>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-surface-600 mb-1">
            {title}
          </p>
          <motion.p 
            className="text-2xl font-bold text-surface-900"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {value}
          </motion.p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${changeColors[changeType]}`}>
              <ApperIcon 
                name={changeType === 'positive' ? 'TrendingUp' : changeType === 'negative' ? 'TrendingDown' : 'Minus'} 
                size={16} 
                className="mr-1" 
              />
              {change}
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <ApperIcon name={icon} size={24} className="text-primary" />
          </div>
        </div>
      </div>
      
      {trend && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-surface-100">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${trend}%` }}
            transition={{ delay: 0.5, duration: 1 }}
          />
        </div>
      )}
    </Card>
  );
};

export default StatsCard;