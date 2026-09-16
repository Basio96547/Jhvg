import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../UI/Button';

interface QuickAction {
  icon: LucideIcon;
  label: string;
  action: () => void;
  color: string;
  badge?: number;
}

interface QuickActionsProps {
  actions: QuickAction[];
  onShowFavorites: () => void;
  onShowMyAds: () => void;
  onShowMessages: () => void;
  favoritesCount: number;
  userAdsCount: number;
  messagesCount: number;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  onShowFavorites,
  onShowMyAds,
  onShowMessages,
  favoritesCount,
  userAdsCount,
  messagesCount,
}) => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="mb-8">
      {/* Mobile Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-6 md:hidden">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.action}
              className={`relative flex items-center space-x-2 space-x-reverse ${action.color} text-white px-4 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 text-sm font-medium`}
            >
              <Icon className="h-5 w-5" />
              <span>{action.label}</span>
              {action.badge && action.badge > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                  {action.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Desktop Quick Actions */}
      <div className="hidden md:flex flex-wrap gap-4 mb-8">
        <Button
          variant="ghost"
          size="md"
          onClick={() => {
            if (!isAuthenticated) {
              alert('يجب تسجيل الدخول أولاً لعرض المفضلة');
              return;
            }
            onShowFavorites();
          }}
          className="bg-red-50 text-red-700 hover:bg-red-100"
        >
          ❤️ {t('favorite')} {isAuthenticated && favoritesCount > 0 && `(${favoritesCount})`}
        </Button>
        <Button
          variant="ghost"
          size="md"
          onClick={() => {
            if (!isAuthenticated) {
              alert('يجب تسجيل الدخول أولاً لعرض إعلاناتك');
              return;
            }
            onShowMyAds();
          }}
          className="bg-blue-50 text-blue-700 hover:bg-blue-100"
        >
          📦 إعلاناتي {isAuthenticated && userAdsCount > 0 && `(${userAdsCount})`}
        </Button>
        <Button
          variant="ghost"
          size="md"
          onClick={() => {
            if (!isAuthenticated) {
              alert('يجب تسجيل الدخول أولاً لعرض الرسائل');
              return;
            }
            onShowMessages();
          }}
          className="bg-green-50 text-green-700 hover:bg-green-100 relative"
        >
          <span>💬 {t('nav.messages')}</span>
          {isAuthenticated && messagesCount > 0 && (
            <span className="bg-green-600 text-white text-xs rounded-full px-2 py-1 mr-2">
              {messagesCount}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;