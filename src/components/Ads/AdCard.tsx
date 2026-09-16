import React, { useState } from 'react';
import { Heart, MapPin, Clock, Star, Eye, MessageCircle, Share2 } from 'lucide-react';
import { Ad } from '../../types';
import { LayoutType, GridSize } from '../Layout/GridLayout';

interface AdCardProps {
  ad: Ad;
  onAdClick: (ad: Ad) => void;
  layout?: LayoutType;
  size?: GridSize;
}

const AdCard: React.FC<AdCardProps> = ({ ad, onAdClick, layout = 'grid', size = 'medium' }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'الآن';
    } else if (diffInHours < 24) {
      return `منذ ${Math.floor(diffInHours)} ساعة`;
    } else if (diffInHours < 48) {
      return 'أمس';
    } else {
      const days = Math.floor(diffInHours / 24);
      return `منذ ${days} يوم`;
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)} مليون ل.س`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(0)} ألف ل.س`;
    }
    return `${price.toLocaleString('ar-SY')} ل.س`;
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

  // Get card classes based on layout and size
  const getCardClasses = () => {
    const baseClasses = "haraj-card cursor-pointer overflow-hidden group w-full transform hover:scale-[1.02] transition-all duration-300";
    
    if (layout === 'list') {
      return `${baseClasses} flex flex-row h-32 sm:h-40`;
    }
    
    return `${baseClasses} flex flex-col h-full`;
  };

  // Get image container classes
  const getImageClasses = () => {
    if (layout === 'list') {
      return "relative w-32 sm:w-48 flex-shrink-0 bg-gray-100";
    }
    
    const aspectRatio = size === 'small' ? 'aspect-square' : 'aspect-[4/3]';
    return `relative overflow-hidden bg-gray-100 ${aspectRatio}`;
  };

  // Get content classes
  const getContentClasses = () => {
    if (layout === 'list') {
      return "flex-1 p-3 sm:p-4 flex flex-col justify-between min-w-0";
    }
    
    return "p-4 space-y-3 flex-1 flex flex-col";
  };
  return (
    <div
      onClick={() => onAdClick(ad)}
      className={getCardClasses()}
    >
      {/* Image Container - Fixed Aspect Ratio */}
      <div className={getImageClasses()}>
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-gray-400 text-sm">جاري التحميل...</div>
          </div>
        )}
        
        {imageError ? (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center">
            <div className="text-6xl mb-2">📷</div>
            <div className="text-gray-500 text-sm font-medium">لا توجد صورة</div>
          </div>
        ) : (
          <img
            src={ad.images[0]}
            alt={ad.title}
            className={`absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            onError={handleImageError}
          />
        )}
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Featured Badge */}
        {ad.featured && (
          <div className="absolute top-3 right-3 featured-badge text-xs px-3 py-1 shadow-lg backdrop-blur-sm">
            ⭐ مميز
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={handleLike}
            className={`p-2 rounded-full shadow-lg backdrop-blur-sm transition-all ${
              isLiked 
                ? 'bg-red-500 text-white' 
                : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
            }`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-gray-600 hover:bg-white hover:text-blue-500 transition-all"
          >
            <Share2 className="h-4 w-4" />
          </button>
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
          
          {/* Condition Badge */}
          <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
            {ad.condition === 'new' && '🆕'}
            {ad.condition === 'like-new' && '✨'}
            {ad.condition === 'good' && '👍'}
            {ad.condition === 'fair' && '⚠️'}
            {ad.condition === 'poor' && '🔧'}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={getContentClasses()}>
        {/* Title and Price */}
        <div className={layout === 'list' ? 'space-y-1' : 'space-y-2'}>
          <h3 className={`font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-blue-700 transition-colors ${
            layout === 'list' ? 'text-sm min-h-[2rem]' : 'text-sm sm:text-base min-h-[2.5rem]'
          }`}>
            {ad.title}
          </h3>
          <div className={`price-text font-bold flex items-center justify-between ${
            layout === 'list' ? 'text-base' : 'text-lg sm:text-xl'
          }`}>
            {formatPrice(ad.price)}
            {ad.featured && (
              <span className={`bg-gradient-to-r from-orange-400 to-orange-500 text-white px-2 py-1 rounded-full font-medium ${
                layout === 'list' ? 'text-xs' : 'text-xs'
              }`}>
                ⭐ مميز
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        {layout !== 'list' && (
        <p className={`text-gray-600 line-clamp-2 leading-relaxed flex-1 ${
          size === 'small' ? 'text-xs min-h-[2rem]' : 'text-xs sm:text-sm min-h-[2.5rem]'
        }`}>
          {ad.description}
        </p>
        )}

        {/* Location and Time */}
        <div className={`flex items-center justify-between text-gray-500 mt-auto ${
          layout === 'list' ? 'text-xs pt-2' : 'text-xs sm:text-sm pt-3 border-t border-gray-100'
        }`}>
          <div className="flex items-center space-x-1 space-x-reverse">
            <MapPin className={`text-blue-600 flex-shrink-0 ${
              layout === 'list' ? 'h-3 w-3' : 'h-3 w-3 sm:h-4 sm:w-4'
            }`} />
            <span className={`truncate ${layout === 'list' ? 'max-w-[80px]' : 'max-w-[100px]'}`}>
              {ad.location}
            </span>
          </div>
          <div className="flex items-center space-x-1 space-x-reverse">
            <Clock className={`text-green-600 flex-shrink-0 ${
              layout === 'list' ? 'h-3 w-3' : 'h-3 w-3 sm:h-4 sm:w-4'
            }`} />
            <span className="whitespace-nowrap">{formatDate(ad.createdAt)}</span>
          </div>
        </div>

        {/* Seller Info */}
        {layout !== 'list' && (
        <div className={`flex items-center justify-between ${
          layout === 'list' ? 'pt-2' : 'pt-3 border-t border-gray-100'
        }`}>
          <div className="flex items-center space-x-2 space-x-reverse flex-1 min-w-0">
            {ad.user?.avatar ? (
              <img
                src={ad.user.avatar}
                alt={ad.user.name}
                className={`rounded-full object-cover border-2 border-blue-100 flex-shrink-0 ${
                  size === 'small' ? 'h-6 w-6' : 'h-8 w-8 sm:h-10 sm:w-10'
                }`}
                loading="lazy"
              />
            ) : (
              <div className={`rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 ${
                size === 'small' ? 'h-6 w-6' : 'h-8 w-8 sm:h-10 sm:w-10'
              }`}>
                <span className={`text-white font-bold ${
                  size === 'small' ? 'text-xs' : 'text-xs sm:text-sm'
                }`}>
                  {ad.user?.name?.charAt(0)}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-gray-900 truncate ${
                size === 'small' ? 'text-xs' : 'text-xs sm:text-sm'
              }`}>
                {ad.user?.name}
              </p>
              <div className="flex items-center space-x-1 space-x-reverse">
                <Star className={`fill-yellow-400 text-yellow-400 flex-shrink-0 ${
                  size === 'small' ? 'h-2 w-2' : 'h-2.5 w-2.5 sm:h-3 sm:w-3'
                }`} />
                <span className={`text-gray-500 truncate ${
                  size === 'small' ? 'text-xs' : 'text-xs'
                }`}>
                  {ad.user?.rating} ({ad.user?.reviewCount})
                </span>
              </div>
            </div>
          </div>
          
          {/* Quick Contact */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle quick message
            }}
            className={`text-blue-600 hover:bg-blue-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 flex-shrink-0 transform hover:scale-110 ${
              size === 'small' ? 'p-1' : 'p-2'
            }`}
          >
            <MessageCircle className={size === 'small' ? 'h-3 w-3' : 'h-4 w-4'} />
          </button>
        </div>
        )}
      </div>
    </div>
  );
};

export default AdCard;