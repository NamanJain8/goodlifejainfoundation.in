import React from 'react';
import { motion } from 'framer-motion';
import { CardProps } from '../../types';

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
}) => {
  const baseClasses = 'card';
  
  const variantClasses = {
    default: '',
    'hover-lift': 'hover:border-primary-500/50',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <motion.div
      className={classes}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={variant === 'hover-lift' ? { y: -8, scale: 1.02 } : { y: -4 }}
    >
      {children}
    </motion.div>
  );
};

export default Card; 