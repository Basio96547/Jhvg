import React from 'react';
import { Ad } from '../../types';
import Carousel from '../UI/Carousel';
import { useLanguage } from '../../contexts/LanguageContext';

interface AdsCarouselProps {
  ads: Ad[];
  title?: string;
  onAdClick: (ad: Ad) => void;
  autoPlay?: boolean;
  itemsPerView?: number;
  aspectRatio?: 'square' | 'video' | 'photo' | 'wide';
  className?: string;
}

const AdsCarousel: React.FC<AdsCarouselProps> = ({
  ads,
  title = 'الإعلانات المميزة',
  onAdClick,
  autoPlay = true,
  itemsPerView = 1,
  aspectRatio = 'photo',
  className = '',
}) => {
  const { t, isRTL } = useLanguage();

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)} مليون ل.س`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(0)} ألف ل.س`;
    }
    return `${price.toLocaleString('ar-SY')} ل.س`;
  };

  const carouselItems = ads.map(ad => ({
    id: ad.id,
    image: ad.images[0],
    title: ad.title,
    description: `${formatPrice(ad.price)} • ${ad.location}`,
    onClick: () => onAdClick(ad),
  }));

  if (ads.length === 0) {
    return null;
  }

  return (
    <div className={`${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3 space-x-reverse">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg">
              <span className="text-white text-xl">⭐</span>
            </div>
            <span>{title}</span>
            <span className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {ads.length} إعلان
            </span>
          </h2>
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1 space-x-reverse">
            <span>عرض الكل</span>
            <span className={`transform transition-transform ${isRTL ? 'rotate-180' : ''}`}>→</span>
          </button>
        </div>
      )}

      <Carousel
        items={carouselItems}
        autoPlay={autoPlay}
        autoPlayInterval={6000}
        showDots={true}
        showArrows={true}
        showPlayPause={false}
        infinite={true}
        itemsPerView={itemsPerView}
        aspectRatio={aspectRatio}
        onItemClick={(item) => {
          const ad = ads.find(a => a.id === item.id);
          if (ad) onAdClick(ad);
        }}
      />
    </div>
  );
};

export default AdsCarousel;