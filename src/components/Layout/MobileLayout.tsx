import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import MobileHeader from './MobileHeader';
import MobileBottomNav from './MobileBottomNav';
import MobileAdCard from '../Ads/MobileAdCard';
import { Ad } from '../../types';
import Button from '../UI/Button';
import { useAuth } from '../../contexts/AuthContext';

interface MobileLayoutProps {
  ads: Ad[];
  onAdClick: (ad: Ad) => void;
  onShowAuth: () => void;
  onShowCreateAd: () => void;
  onShowMessages: () => void;
  onShowProfile: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  messagesCount?: number;
  unreadCount?: number;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  ads,
  onAdClick,
  onShowAuth,
  onShowCreateAd,
  onShowMessages,
  onShowProfile,
  searchQuery,
  onSearchChange,
  messagesCount = 0,
  unreadCount = 0,
  selectedCategory,
  onCategoryChange,
}) => {
  const { t, isRTL, language } = useLanguage();
  const { isAuthenticated } = useAuth();

  const categories = [
    { key: 'سيارات', icon: '🚗', count: ads.filter(ad => ad.category === 'سيارات').length },
    { key: 'عقارات', icon: '🏠', count: ads.filter(ad => ad.category === 'عقارات').length },
    { key: 'إلكترونيات', icon: '📱', count: ads.filter(ad => ad.category === 'إلكترونيات').length },
    { key: 'أثاث', icon: '🪑', count: ads.filter(ad => ad.category === 'أثاث').length },
    { key: 'أزياء', icon: '👕', count: ads.filter(ad => ad.category === 'أزياء').length },
    { key: 'رياضة', icon: '⚽', count: ads.filter(ad => ad.category === 'رياضة').length },
  ];

  const handleCategoryClick = (category: string) => {
    onCategoryChange(category);
    // التمرير إلى قسم الإعلانات
    setTimeout(() => {
      document.getElementById('ads-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleNearbyClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          alert(`تم تحديد موقعك: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}\nسيتم عرض الإعلانات القريبة منك`);
          // هنا يمكن إضافة منطق البحث حسب الموقع
          // يمكن فلترة الإعلانات حسب المسافة من الموقع الحالي
        },
        (error) => {
          let errorMessage = '';
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'تم رفض طلب الوصول للموقع. يرجى السماح بالوصول للموقع لعرض الإعلانات القريبة.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'معلومات الموقع غير متوفرة.';
              break;
            case error.TIMEOUT:
              errorMessage = 'انتهت مهلة طلب الموقع.';
              break;
            default:
              errorMessage = 'حدث خطأ غير معروف في تحديد الموقع.';
              break;
          }
          alert(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    } else {
      alert('متصفحك لا يدعم خدمة تحديد الموقع');
    }
  };
  return (
    <>
      <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
        <MobileHeader
          onShowAuth={onShowAuth}
          onShowCreateAd={onShowCreateAd}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onShowNearby={handleNearbyClick}
        />

        {/* Main Content */}
        <div className="pt-4 pb-24 px-4" id="main-content">
          {/* Quick Stats */}
          <div className="mb-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-4" id="stats-section">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{ads.length.toLocaleString()}</div>
                <div className="text-xs opacity-90">
                  إعلان نشط
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold">95%</div>
                <div className="text-xs opacity-90">
                  {language === 'ar' ? 'عملاء راضون' : language === 'tr' ? 'Memnun Müşteri' : 'Happy Customers'}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-xs opacity-90">
                  {language === 'ar' ? 'دعم العملاء' : language === 'tr' ? 'Müşteri Desteği' : 'Support'}
                </div>
              </div>
            </div>
          </div>

          {/* Categories Section */}
          <div className="mb-6" id="categories-section">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">الأقسام الرئيسية</h2>
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => handleCategoryClick('all')}
                  className="text-blue-600 text-sm font-medium"
                >
                  عرض الكل
                </button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => handleCategoryClick(category.key)}
                  className={`rounded-lg p-3 shadow-sm border transition-all ${
                    selectedCategory === category.key
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-white border-gray-100 hover:shadow-md hover:border-blue-200'
                  }`}
                >
                  <div className="text-2xl mb-1">{category.icon}</div>
                  <div className={`text-xs font-medium ${
                    selectedCategory === category.key ? 'text-white' : 'text-gray-700'
                  }`}>
                    {category.key}
                  </div>
                  {category.count > 0 && (
                    <div className={`text-xs mt-1 ${
                      selectedCategory === category.key ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {category.count} إعلان
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Ads Grid */}
          <div className="space-y-4" id="ads-section">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                {selectedCategory === 'all' ? 'أحدث الإعلانات' : `إعلانات ${selectedCategory}`}
              </h2>
              <span className="text-sm text-gray-500">
                {ads.length} إعلان
              </span>
            </div>
            
            {ads.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  لا توجد إعلانات
                </h3>
                <p className="text-gray-600 mb-4">
                  {selectedCategory === 'all' 
                    ? 'لا توجد إعلانات متاحة حالياً'
                    : `لا توجد إعلانات في قسم ${selectedCategory}`
                  }
                </p>
                {selectedCategory !== 'all' && (
                  <button
                    onClick={() => handleCategoryClick('all')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    عرض جميع الإعلانات
                  </button>
                )}
              </div>
            ) : (
              ads.map((ad) => (
              <MobileAdCard key={ad.id} ad={ad} onAdClick={onAdClick} />
              ))
            )}
          </div>

          {/* Load More */}
          {ads.length > 0 && (
            <div className="mt-8 text-center">
            <Button
              variant="primary"
              size="lg"
              gradient
              shadow
              className="px-8"
            >
              {language === 'ar' ? 'تحميل المزيد' : language === 'tr' ? 'Daha Fazla Yükle' : 'Load More'}
            </Button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <MobileBottomNav
        onShowCreateAd={onShowCreateAd}
        onShowAuth={onShowAuth}
        onShowMessages={onShowMessages}
        onShowProfile={onShowProfile}
        messagesCount={messagesCount}
        notificationsCount={unreadCount}
      />
    </>
  );
};

export default MobileLayout;