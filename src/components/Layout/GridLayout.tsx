import React, { useState } from 'react';
import { Grid3X3, List, LayoutGrid, Rows3, Square, Maximize2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export type LayoutType = 'grid' | 'list' | 'masonry' | 'compact';
export type GridSize = 'small' | 'medium' | 'large';

interface GridLayoutProps {
  children: React.ReactNode;
  layoutType?: LayoutType;
  gridSize?: GridSize;
  showLayoutControls?: boolean;
  onLayoutChange?: (layout: LayoutType) => void;
  onGridSizeChange?: (size: GridSize) => void;
  className?: string;
}

const GridLayout: React.FC<GridLayoutProps> = ({
  children,
  layoutType = 'grid',
  gridSize = 'medium',
  showLayoutControls = true,
  onLayoutChange,
  onGridSizeChange,
  className = '',
}) => {
  const [currentLayout, setCurrentLayout] = useState<LayoutType>(layoutType);
  const [currentGridSize, setCurrentGridSize] = useState<GridSize>(gridSize);
  const { isRTL } = useLanguage();

  const handleLayoutChange = (layout: LayoutType) => {
    setCurrentLayout(layout);
    onLayoutChange?.(layout);
  };

  const handleGridSizeChange = (size: GridSize) => {
    setCurrentGridSize(size);
    onGridSizeChange?.(size);
  };

  const getGridClasses = () => {
    const baseClasses = 'grid gap-4 md:gap-6';
    
    switch (currentLayout) {
      case 'list':
        return `${baseClasses} grid-cols-1`;
      
      case 'compact':
        switch (currentGridSize) {
          case 'small':
            return `${baseClasses} grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7`;
          case 'medium':
            return `${baseClasses} grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6`;
          case 'large':
            return `${baseClasses} grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5`;
          default:
            return `${baseClasses} grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5`;
        }
      
      case 'masonry':
        return `columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 md:gap-6 space-y-4 md:space-y-6`;
      
      case 'grid':
      default:
        switch (currentGridSize) {
          case 'small':
            return `${baseClasses} grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6`;
          case 'medium':
            return `${baseClasses} grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`;
          case 'large':
            return `${baseClasses} grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`;
          default:
            return `${baseClasses} grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`;
        }
    }
  };

  const layoutOptions = [
    { type: 'grid' as LayoutType, icon: Grid3X3, label: 'شبكة' },
    { type: 'list' as LayoutType, icon: List, label: 'قائمة' },
    { type: 'compact' as LayoutType, icon: LayoutGrid, label: 'مضغوط' },
    { type: 'masonry' as LayoutType, icon: Rows3, label: 'متدرج' },
  ];

  const sizeOptions = [
    { size: 'small' as GridSize, icon: Square, label: 'صغير' },
    { size: 'medium' as GridSize, icon: Square, label: 'متوسط' },
    { size: 'large' as GridSize, icon: Maximize2, label: 'كبير' },
  ];

  return (
    <div className={className}>
      {/* Layout Controls */}
      {showLayoutControls && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Layout Type Controls */}
          <div className="flex items-center space-x-2 space-x-reverse">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">نوع العرض:</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              {layoutOptions.map(({ type, icon: Icon, label }) => (
                <button
                  key={type}
                  onClick={() => handleLayoutChange(type)}
                  className={`flex items-center space-x-1 space-x-reverse px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    currentLayout === type
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                  }`}
                  title={label}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Grid Size Controls */}
          {currentLayout !== 'list' && (
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">حجم العناصر:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                {sizeOptions.map(({ size, icon: Icon, label }) => (
                  <button
                    key={size}
                    onClick={() => handleGridSizeChange(size)}
                    className={`flex items-center space-x-1 space-x-reverse px-3 py-2 rounded-md text-sm font-medium transition-all ${
                      currentGridSize === size
                        ? 'bg-green-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                    }`}
                    title={label}
                  >
                    <Icon className={`h-3 w-3 ${size === 'small' ? 'h-3 w-3' : size === 'large' ? 'h-5 w-5' : 'h-4 w-4'}`} />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="text-sm text-gray-500">
            <span>العرض الحالي: </span>
            <span className="font-medium text-gray-700">
              {layoutOptions.find(opt => opt.type === currentLayout)?.label}
              {currentLayout !== 'list' && ` - ${sizeOptions.find(opt => opt.size === currentGridSize)?.label}`}
            </span>
          </div>
        </div>
      )}

      {/* Content Grid */}
      <div className={getGridClasses()}>
        {currentLayout === 'masonry' ? (
          // Masonry layout needs special handling
          React.Children.map(children, (child, index) => (
            <div key={index} className="break-inside-avoid mb-4 md:mb-6">
              {child}
            </div>
          ))
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default GridLayout;