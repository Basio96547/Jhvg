import React, { useState } from 'react';
import { Search, Globe, Menu, X, Bell, MessageCircle, Plus, Home, Grid3X3 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../UI/Button';
import IconButton from '../UI/IconButton';

interface MobileHeaderProps {
  onShowAuth: () => void;
  onShowCreateAd: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onShowNearby?: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  onShowAuth,
  onShowCreateAd,
  searchQuery,
  onSearchChange,
  onShowNearby,
}) => {
  const { language, setLanguage, t, isRTL } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const languages = [
    { code: 'ar', name: 'العربية', flag: '🇸🇾' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  const handleNearbyClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          alert(`تم تحديد موقعك: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}\nسيتم عرض الإعلانات القريبة منك`);
          // هنا يمكن إضافة منطق البحث حسب الموقع
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
          maximumAge: 300000
        }
      );
    } else {
      alert('متصفحك لا يدعم خدمة تحديد الموقع');
    }
  };
  return (
    <>
      {/* Top Status Bar */}
      <div className="bg-gray-900 text-white px-4 py-2 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2 space-x-reverse">
          <div className="flex items-center space-x-1 space-x-reverse">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
          </div>
          <span>4G</span>
          <span>📶</span>
        </div>
        <div className="text-center font-bold">12:39</div>
        <div className="flex items-center space-x-1 space-x-reverse">
          <span>82%</span>
          <div className="w-6 h-3 border border-white rounded-sm">
            <div className="w-5 h-2 bg-white rounded-sm m-0.5"></div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white shadow-lg border-b sticky top-0 z-50">
        {/* Top Row */}
        <div className="px-4 py-3 flex items-center justify-between">
          {/* Language Selector */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              icon={Globe}
              iconPosition="right"
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="bg-gray-100 hover:bg-gray-200"
            >
              <span className="text-sm font-medium ml-1">{currentLanguage?.flag}</span>
              <span className="text-xs">{currentLanguage?.name}</span>
            </Button>

            {showLanguageMenu && (
              <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-[150px]">
                {languages.map((lang) => (
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code as any);
                      setShowLanguageMenu(false);
                    }}
                    className={`justify-start ${
                      language === lang.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="font-medium">{lang.name}</span>
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* App Title */}
          <div className="text-center">
            <h1 className="text-lg font-bold text-blue-700">{t('app.name')}</h1>
            <p className="text-xs text-gray-500">{t('app.tagline')}</p>
          </div>

          {/* Empty space for balance */}
          <div className="w-12"></div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className={`absolute top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 ${
              isRTL ? 'right-3' : 'left-3'
            }`} />
            <input
              type="text"
              placeholder={t('search.placeholder')}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`w-full bg-gray-100 border-0 rounded-xl py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all ${
                isRTL ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'
              }`}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-4 pb-3">
          <div className="flex space-x-2 space-x-reverse overflow-x-auto">
            <Button
              variant="ghost"
              size="sm"
              rounded
              onClick={handleNearbyClick}
              className="flex-shrink-0 bg-green-100 text-green-700 hover:bg-green-200 border border-green-300"
            >
              📍 {t('category.nearby')}
            </Button>
            <Button
              variant="primary"
              size="sm"
              rounded
              className="flex-shrink-0"
            >
              {t('category.all')}
            </Button>
          </div>
        </div>
      </div>


      {/* Overlay for language menu */}
      {showLanguageMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-40"
          onClick={() => setShowLanguageMenu(false)}
        />
      )}
    </>
  );
};

export default MobileHeader;