import React from 'react';
import { Ad } from '../../types';
import AdCard from './AdCard';

interface AdGridProps {
  ads: Ad[];
  onAdClick: (ad: Ad) => void;
}

const AdGrid: React.FC<AdGridProps> = ({ ads, onAdClick }) => {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 auto-rows-fr">
      {ads.map((ad) => (
        <AdCard key={ad.id} ad={ad} onAdClick={onAdClick} />
      ))}
    </div>
  );
};

export default AdGrid;