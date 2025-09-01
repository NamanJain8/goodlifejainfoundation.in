import React from 'react';
import { CardProps } from '../../types';

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
}) => {
  const baseClasses = 'card motion-safe';
  
  const variantClasses = {
    default: '',
    'hover-lift': 'hover:border-primary-500/50',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

export default Card; 