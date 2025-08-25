import React from 'react';
import { motion } from 'framer-motion';
import { CardProps } from '../../types';
import { fastVariants } from '../../hooks/useScrollAnimation';

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
    <motion.div
      className={classes}
      variants={fastVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      whileHover={variant === 'hover-lift' ? { y: -6, scale: 1.01 } : { y: -3 }}
      transition={{ type: "spring", damping: 25, stiffness: 400 }}
    >
      {children}
    </motion.div>
  );
};

export default Card; 