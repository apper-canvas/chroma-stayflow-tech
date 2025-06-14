import React, { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = ({
  label,
  error,
  icon,
  type = 'text',
  className = '',
  required = false,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);

  const handleFocus = () => setFocused(true);
  const handleBlur = (e) => {
    setFocused(false);
    setHasValue(!!e.target.value);
  };

  const inputClasses = `
    block w-full px-3 py-3 text-base
    border border-surface-300 rounded-lg
    bg-surface placeholder-transparent
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent
    ${error ? 'border-error focus:ring-error focus:border-error' : ''}
    ${icon ? 'pl-10' : ''}
    ${className}
  `;

  const labelClasses = `
    absolute left-3 transition-all duration-200 pointer-events-none
    ${focused || hasValue 
      ? 'text-xs text-surface-600 -top-2 bg-surface px-1' 
      : 'text-base text-surface-500 top-3'
    }
    ${error ? 'text-error' : ''}
    ${icon && !(focused || hasValue) ? 'left-10' : ''}
  `;

  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-3 z-10">
          <ApperIcon name={icon} size={20} className="text-surface-400" />
        </div>
      )}
      <input
        type={type}
        className={inputClasses}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      {label && (
        <label className={labelClasses}>
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      {error && (
        <p className="mt-1 text-sm text-error flex items-center">
          <ApperIcon name="AlertCircle" size={16} className="mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;