import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary shadow-sm',
    secondary: 'bg-secondary text-primary hover:bg-secondary/90 focus:ring-secondary shadow-sm',
    outline: 'border border-surface-300 text-surface-700 hover:bg-surface-50 focus:ring-accent',
    ghost: 'text-surface-600 hover:bg-surface-100 focus:ring-accent',
    danger: 'bg-error text-white hover:bg-error/90 focus:ring-error shadow-sm'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 20 : 18;
  const iconSpacing = size === 'sm' ? 'space-x-1.5' : 'space-x-2';

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={`${buttonClasses} ${icon ? iconSpacing : ''}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <ApperIcon name="Loader2" size={iconSize} className="animate-spin" />
      )}
      {!loading && icon && iconPosition === 'left' && (
        <ApperIcon name={icon} size={iconSize} />
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <ApperIcon name={icon} size={iconSize} />
      )}
    </motion.button>
  );
};

export default Button;