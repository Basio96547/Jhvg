import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  badge?: number | string;
  badgeColor?: 'red' | 'green' | 'blue' | 'yellow' | 'purple';
  tooltip?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  variant = 'ghost',
  size = 'md',
  rounded = true,
  badge,
  badgeColor = 'red',
  tooltip,
  className = '',
  ...props
}) => {
  const baseClasses = 'relative inline-flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-110 active:scale-95';

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-900 focus:ring-gray-500',
  };

  const sizeClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const badgeColors = {
    red: 'bg-red-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
  };

  const roundedClasses = rounded ? 'rounded-full' : 'rounded-lg';

  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${roundedClasses}
        ${className}
      `}
      title={tooltip}
      {...props}
    >
      <Icon className={iconSizes[size]} />
      
      {badge && (
        <span className={`
          absolute -top-1 -right-1 ${badgeColors[badgeColor]} text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg
          ${typeof badge === 'number' && badge > 99 ? 'px-1' : ''}
        `}>
          {typeof badge === 'number' && badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  );
};

export default IconButton;