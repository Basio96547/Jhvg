import React from 'react';

interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  orientation = 'horizontal',
  size = 'md',
  className = '',
}) => {
  const baseClasses = 'inline-flex';
  const orientationClasses = orientation === 'horizontal' ? 'flex-row' : 'flex-col';
  
  const spacingClasses = {
    sm: orientation === 'horizontal' ? 'space-x-1' : 'space-y-1',
    md: orientation === 'horizontal' ? 'space-x-2' : 'space-y-2',
    lg: orientation === 'horizontal' ? 'space-x-3' : 'space-y-3',
  };

  return (
    <div className={`
      ${baseClasses}
      ${orientationClasses}
      ${spacingClasses[size]}
      ${className}
    `}>
      {children}
    </div>
  );
};

export default ButtonGroup;