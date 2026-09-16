import React, { useState } from 'react';
import { Heart, MapPin, Clock, User, Eye, Share2 } from 'lucide-react';
import { Ad } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import IconButton from '../UI/IconButton';

interface MobileAdCardProps {
  ad: Ad;
  onAdClick: (ad: Ad) => void;
}

const MobileAdCard: React.FC<MobileAdCardProps> = ({ ad, onAdClick }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { t, isRTL, language } = useLanguage();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);

    if (diffInMinutes < 60) {
      return t('time.minutes_ago', Math.floor(diffInMinutes).toString());
    } else if (diffInMinutes < 1440) {
      return t('time.hours_ago', Math.floor(diffInMinutes / 60).toString());
    } else {
      return t('time.days_ago', Math.floor(diffInMinutes / 1440).toString());
    }
  };

  const formatPrice = (price: number) => {
    let currency = t('price.currency');
    let formattedPrice = price.toLocaleString(language === 'ar' ? 'ar-SY' : language === 'tr' ? 'tr-TR' : 'en-US');
    
    if (language === 'tr') {
      // Convert Syrian Pounds to Turkish Lira (approximate)
      const tlPrice = Math.round(price / 100);
      formattedPrice = tlPrice.toLocaleString('tr-TR');
    }
    
    return `${formattedPrice} ${currency}`;
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: ad.title,
        text: ad.description,
        url: window.location.href,
      });
    }
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <div
      onClick={() => onAdClick(ad)}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative h-48 bg-gray-100">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-gray-400 text-sm">{language === 'ar' ? 'جاري التحميل...' : language === 'tr' ? 'Yükleniyor...' : 'Loading...'}</div>
          </div>
        )}
        
        {imageError ? (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center">
            <div className="text-4xl mb-2">📷</div>
            <div className="text-gray-500 text-sm font-medium">
              {language === 'ar' ? 'لا توجد صورة' : language === 'tr' ? 'Resim yok' : 'No image'}
            </div>
          </div>
        ) : (
          <img
            src={ad.images[0]}
            alt={ad.title}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={handleImageError}
          />
        )}
        
        {/* Featured Badge */}
        {ad.featured && (
          <div className={`absolute top-3 bg-gradient-to-r from-orange-400 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
            isRTL ? 'right-3' : 'left-3'
          }`}>
            ⭐ {t('featured')}
          </div>
        )}

        {/* Action Buttons */}
        <div className={`absolute top-3 flex flex-col space-y-2 ${isRTL ? 'left-3' : 'right-3'}`}>
          <IconButton
            icon={Heart}
            variant={isLiked ? 'danger' : 'ghost'}
            onClick={handleLike}
            size="sm"
            className="shadow-lg backdrop-blur-sm bg-white/90"
          />
          <IconButton
            icon={Share2}
            variant="ghost"
            onClick={handleShare}
            size="sm"
            className="shadow-lg backdrop-blur-sm bg-white/90 hover:text-blue-500"
          />
        </div>

        {/* Bottom Stats */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 space-x-reverse">
            <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1 space-x-reverse">
              <Eye className="h-3 w-3" />
              <span>{ad.views}</span>
            </div>
            {ad.images.length > 1 && (
              <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1 space-x-reverse">
                <span>📷</span>
                <span>{ad.images.length}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className={`font-bold text-gray-900 line-clamp-2 leading-tight ${
          isRTL ? 'text-right' : 'text-left'
        }`}>
          {ad.title}
        </h3>

        {/* Price */}
        <div className={`text-xl font-bold text-blue-600 ${isRTL ? 'text-right' : 'text-left'}`}>
          {formatPrice(ad.price)}
        </div>

        {/* Location and Time */}
        <div className={`flex items-center justify-between text-sm text-gray-500 ${
          isRTL ? 'flex-row-reverse' : ''
        }`}>
          <div className="flex items-center space-x-1 space-x-reverse">
            <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0" />
            <span className="truncate">{ad.location}</span>
          </div>
          <div className="flex items-center space-x-1 space-x-reverse">
            <Clock className="h-4 w-4 text-green-600 flex-shrink-0" />
            <span className="whitespace-nowrap">{formatDate(ad.createdAt)}</span>
          </div>
        </div>

        {/* Seller Info */}
        <div className={`flex items-center justify-between pt-3 border-t border-gray-100 ${
          isRTL ? 'flex-row-reverse' : ''
        }`}>
          <div className="flex items-center space-x-2 space-x-reverse flex-1 min-w-0">
            {ad.user?.avatar ? (
              <img
                src={ad.user.avatar}
                alt={ad.user.name}
                className="h-8 w-8 rounded-full object-cover border-2 border-blue-100 flex-shrink-0"
                loading="lazy"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 text-white" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold text-gray-900 truncate ${
                isRTL ? 'text-right' : 'text-left'
              }`}>
                {ad.user?.name}
              </p>
              <div className="flex items-center space-x-1 space-x-reverse">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div
                      key={star}
                      className={`h-2.5 w-2.5 rounded-full ${
                        star <= (ad.user?.rating || 0) ? 'bg-yellow-400' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">
                  ({ad.user?.reviewCount})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileAdCard;