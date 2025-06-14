import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={className}
    >
      <ApperIcon name="Loader2" size={sizes[size]} className="text-accent" />
    </motion.div>
  );
};

export default LoadingSpinner;