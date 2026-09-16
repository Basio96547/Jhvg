import React from 'react';
import { Home, Grid3X3, Plus, MessageCircle, Bell, User } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../UI/Button';
import IconButton from '../UI/IconButton';

interface MobileBottomNavProps {
  onShowCreateAd: () => void;
  onShowAuth: () => void;
  onShowMessages: () => void;
  onShowProfile: () => void;
  onShowCategories?: () => void;
  onShowNotifications?: () => void;
  messagesCount?: number;
  notificationsCount?: number;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onShowCreateAd,
  onShowAuth,
  onShowMessages,
  onShowProfile,
  onShowCategories,
  onShowNotifications,
  messagesCount = 0,
  notificationsCount = 0,
}) => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();

  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoriesClick = () => {
    // التمرير إلى قسم الفئات
    document.getElementById('categories-section')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleMessagesClick = () => {
    if (isAuthenticated) {
      onShowMessages();
    } else {
      onShowAuth();
    }
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      onShowProfile();
    } else {
      onShowAuth();
    }
  };

  const handleNotificationsClick = () => {
    if (isAuthenticated) {
      onShowNotifications?.();
    } else {
      onShowAuth();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
      <div className="flex items-center justify-around py-2 px-2">
        {/* Home */}
        <button
          onClick={handleHomeClick}
          className="flex flex-col items-center justify-center p-2 min-w-[60px] text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1 font-medium">{t('nav.home')}</span>
        </button>
        
        {/* Categories */}
        <button
          onClick={handleCategoriesClick}
          className="flex flex-col items-center justify-center p-2 min-w-[60px] text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <Grid3X3 className="h-6 w-6" />
          <span className="text-xs mt-1">{t('nav.categories')}</span>
        </button>
        
        {/* Add Ad - Center Button */}
        <button
          onClick={() => {
            if (isAuthenticated) {
              onShowCreateAd();
            } else {
              alert('يجب تسجيل الدخول أولاً لإضافة إعلان');
              onShowAuth();
            }
          }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
        >
          <Plus className="h-7 w-7" />
        </button>
        
        {/* Messages */}
        <button
          onClick={handleMessagesClick}
          className="relative flex flex-col items-center justify-center p-2 min-w-[60px] text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="text-xs mt-1">{t('nav.messages')}</span>
          {messagesCount > 0 && isAuthenticated && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              {messagesCount > 9 ? '9+' : messagesCount}
            </span>
          )}
        </button>
        
        {/* Profile/Auth */}
        <button
          onClick={handleProfileClick}
          className="relative flex flex-col items-center justify-center p-2 min-w-[60px] text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">{isAuthenticated ? 'الملف' : 'دخول'}</span>
        </button>
      </div>
    </div>
  );
};

export default MobileBottomNav;