import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  onClick,
  padding = 'md',
  ...props 
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const baseClasses = `bg-surface rounded-lg shadow-sm border border-surface-200 ${paddings[padding]}`;
  const hoverClasses = hover ? 'cursor-pointer transition-all duration-200' : '';
  const cardClasses = `${baseClasses} ${hoverClasses} ${className}`;

  if (hover || onClick) {
    return (
      <motion.div
        whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}
        whileTap={{ scale: 0.98 }}
        className={cardClasses}
        onClick={onClick}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;