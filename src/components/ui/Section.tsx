import React from 'react';
import { SectionProps } from '../../types';

const Section: React.FC<SectionProps> = ({
  children,
  className = '',
  variant = 'default',
  id,
}) => {
  const baseClasses = 'section';
  
  const variantClasses = {
    default: '',
    alt: 'section-alt',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <section id={id} className={classes}>
      <div className="container">
        {children}
      </div>
    </section>
  );
};

export default Section; 