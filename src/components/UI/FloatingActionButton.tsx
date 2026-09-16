import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface FloatingActionButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'success';
  size?: 'md' | 'lg';
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  label?: string;
  className?: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon: Icon,
  onClick,
  variant = 'primary',
  size = 'lg',
  position = 'bottom-right',
  label,
  className = '',
}) => {
  const baseClasses = 'fixed z-50 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white focus:ring-blue-500',
    secondary: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white focus:ring-orange-500',
    success: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white focus:ring-green-500',
  };

  const sizeClasses = {
    md: 'p-3',
    lg: 'p-4',
  };

  const iconSizes = {
    md: 'h-6 w-6',
    lg: 'h-7 w-7',
  };

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 transform -translate-x-1/2',
  };

  return (
    <div className={`${positionClasses[position]} ${className}`}>
      {label && (
        <div className="mb-2 bg-black bg-opacity-75 text-white px-3 py-1 rounded-lg text-sm font-medium opacity-0 hover:opacity-100 transition-opacity duration-300">
          {label}
        </div>
      )}
      <button
        onClick={onClick}
        className={`
          ${baseClasses}
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          rounded-full
        `}
      >
        <Icon className={iconSizes[size]} />
      </button>
    </div>
  );
};

export default FloatingActionButton;