import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  color?: string;
}

const Icon: React.FC<IconProps> = ({ name, size = 24, className = '', color }) => {
  // Get the icon component from Lucide React
  const IconComponent = (LucideIcons as any)[name];
  
  if (!IconComponent) {
    // Fallback to a default icon if the specified icon doesn't exist
    return <LucideIcons.HelpCircle size={size} className={className} color={color} />;
  }

  return <IconComponent size={size} className={className} color={color} />;
};

export default Icon; 