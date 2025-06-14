import React from 'react';

const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const variants = {
    default: 'bg-surface-100 text-surface-800',
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-primary',
    success: 'bg-success text-white',
    warning: 'bg-warning text-white',
    error: 'bg-error text-white',
    info: 'bg-info text-white',
    available: 'bg-success/10 text-success border border-success/20',
    occupied: 'bg-info/10 text-info border border-info/20',
    maintenance: 'bg-warning/10 text-warning border border-warning/20',
    checkout: 'bg-error/10 text-error border border-error/20',
    reserved: 'bg-secondary/10 text-secondary border border-secondary/20'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  const badgeClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <span className={badgeClasses}>
      {children}
    </span>
  );
};

export default Badge;