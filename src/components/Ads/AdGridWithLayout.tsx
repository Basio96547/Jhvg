import React, { useState } from 'react';
import { Ad } from '../../types';
import AdCard from './AdCard';
import GridLayout, { LayoutType, GridSize } from '../Layout/GridLayout';
import { useLanguage } from '../../contexts/LanguageContext';

interface AdGridWithLayoutProps {
  ads: Ad[];
  onAdClick: (ad: Ad) => void;
  className?: string;
}

const AdGridWithLayout: React.FC<AdGridWithLayoutProps> = ({ 
  ads, 
  onAdClick, 
  className = '' 
}) => {
  const [layoutType, setLayoutType] = useState<LayoutType>('grid');
  const [gridSize, setGridSize] = useState<GridSize>('medium');
  const { t } = useLanguage();

  if (ads.length === 0) {
    return (
      <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl">
        <div className="max-w-md mx-auto">
          <div className="text-8xl mb-6 animate-bounce">🔍</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">لا توجد إعلانات مطابقة</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            جرب تغيير معايير البحث أو الفئة للعثور على ما تبحث عنه
          </p>
          <div className="space-y-3">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              مسح الفلاتر
            </button>
            <p className="text-sm text-gray-500">أو تصفح جميع الإعلانات المتاحة</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <GridLayout
        layoutType={layoutType}
        gridSize={gridSize}
        showLayoutControls={true}
        onLayoutChange={setLayoutType}
        onGridSizeChange={setGridSize}
      >
        {ads.map((ad) => (
          <div 
            key={ad.id} 
            className={`
              ${layoutType === 'list' ? 'w-full' : ''}
              ${layoutType === 'masonry' ? 'break-inside-avoid' : ''}
            `}
          >
            <AdCard 
              ad={ad} 
              onAdClick={onAdClick}
              layout={layoutType}
              size={gridSize}
            />
          </div>
        ))}
      </GridLayout>
    </div>
  );
};

export default AdGridWithLayout;