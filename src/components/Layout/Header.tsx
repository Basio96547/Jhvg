import React, { useState } from 'react';
import { Search, Plus, MessageSquare, User, Menu, X, Heart, Package, ShoppingCart, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import Button from '../UI/Button';
import IconButton from '../UI/IconButton';
import ButtonGroup from '../UI/ButtonGroup';

interface HeaderProps {
  onShowAuth: () => void;
  onShowCreateAd: () => void;
  onShowProfile: () => void;
  onShowMessages: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  suggestions?: Array<{ id: string; title: string; category: string }>;
  showSuggestions?: boolean;
  onCloseSuggestions?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onShowAuth,
  onShowCreateAd,
  onShowProfile,
  onShowMessages,
  searchQuery,
  onSearchChange,
  suggestions = [],
  showSuggestions = false,
  onCloseSuggestions,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const handleSearchFocus = () => {
    setSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setSearchFocused(false);
      onCloseSuggestions?.();
    }, 200);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4 space-x-reverse">
              <span className="flex items-center space-x-2 space-x-reverse">
                <span>🎉</span>
                <span>مرحباً بك في شاري مستعمل</span>
              </span>
              <span className="hidden lg:inline">•</span>
              <span className="hidden lg:inline">موقع البيع والشراء الأول في سوريا</span>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <span className="hidden lg:inline">تابعنا على:</span>
              <div className="flex space-x-3 space-x-reverse">
                <a href="#" className="hover:text-blue-200 transition-colors text-sm">📘 فيسبوك</a>
                <a href="#" className="hover:text-blue-200 transition-colors text-sm">📱 تليجرام</a>
                <a href="#" className="hover:text-blue-200 transition-colors text-sm">📷 إنستغرام</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-lg border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
                  <ShoppingCart className="h-6 w-6 md:h-8 md:w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-800 bg-clip-text text-transparent">
                    شاري مستعمل
                  </h1>
                  <p className="text-xs text-gray-500 hidden md:block">موقع البيع والشراء</p>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl mx-4 md:mx-8">
              <div className="relative">
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="البحث الذكي متاح في الصفحة الرئيسية..."
                placeholder={searchQuery ? "ابحث في الإعلانات..." : "البحث الذكي متاح في الصفحة الرئيسية..."}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pr-12 pl-4 py-2 md:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right text-sm md:text-base transition-all shadow-sm hover:shadow-md bg-gray-50"
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                  dir="rtl"
                  disabled
                />
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 md:px-4 py-1 md:py-2 rounded-lg text-sm font-medium shadow-md opacity-50">
                  🧠 ذكي
                </div>
              </div>
              
              {/* Search Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
                  <div className="p-2">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={`${suggestion.id}-${index}`}
                        onClick={() => {
                          onSearchChange(suggestion.title);
                          onCloseSuggestions?.();
                        }}
                        className="w-full px-4 py-3 text-right hover:bg-blue-50 transition-colors rounded-lg flex items-center space-x-3 space-x-reverse"
                      >
                        <div className="text-2xl">📦</div>
                        <div className="flex-1 min-w-0 text-right">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {suggestion.title}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {suggestion.category}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4 space-x-reverse">
              {isAuthenticated ? (
                <>
                  <button>
                  <Button
                    variant="secondary"
                    size="md"
                    icon={Plus}
                    iconPosition="right"
                    gradient
                    shadow
                    onClick={onShowCreateAd}
                    className="relative overflow-hidden"
                  >
                    <span>أضف إعلانك مجاناً</span>
                  </Button>
                  </button>
                  
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <IconButton
                      icon={MessageSquare}
                      variant="ghost"
                      badge={0}
                      badgeColor="red"
                      tooltip="الرسائل"
                      onClick={() => onShowMessages()}
                      className="hover:bg-blue-50 hover:text-blue-700"
                    />
                    
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="flex items-center space-x-3 space-x-reverse text-gray-600 hover:text-blue-700 transition-colors p-2 rounded-xl hover:bg-blue-50"
                    >
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="h-10 w-10 rounded-full object-cover border-2 border-blue-200 shadow-md"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md">
                          <User className="h-6 w-6 text-white" />
                        </div>
                      )}
                      <div className="hidden lg:block text-right">
                        <p className="font-semibold">{user?.name}</p>
                        <p className="text-xs text-gray-500">عضو مميز ⭐</p>
                      </div>
                    </button>
                    
                    {isMenuOpen && (
                      <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border py-2 z-50">
                        <div className="px-4 py-3 border-b">
                          <p className="font-semibold text-gray-900">{user?.name}</p>
                          <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                        <button
                          onClick={() => {
                            onShowProfile();
                            setIsMenuOpen(false);
                          }}
                          className="block w-full text-right px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        >
                          <div className="flex items-center space-x-3 space-x-reverse">
                            <User className="h-5 w-5" />
                            <span>الملف الشخصي</span>
                          </div>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-right px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
                        >
                          تسجيل الخروج
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
               <div className="flex items-center space-x-3 space-x-reverse">
                 <Button
                   variant="ghost"
                   size="md"
                   icon={Plus}
                   iconPosition="right"
                   onClick={() => {
                     alert('يجب تسجيل الدخول أولاً لإضافة إعلان');
                     onShowAuth();
                   }}
                   className="text-gray-600 hover:text-blue-600 border border-gray-300 hover:border-blue-300"
                 >
                   <span>أضف إعلانك</span>
                 </Button>
                <Button
                  variant="primary"
                  size="md"
                  icon={User}
                  iconPosition="right"
                  gradient
                  shadow
                  onClick={onShowAuth}
                >
                  <span>دخول / تسجيل</span>
                </Button>
               </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t py-4 bg-gray-50 rounded-b-xl">
              <div className="space-y-3">
                {isAuthenticated ? (
                  <>
                    <Button
                      variant="secondary"
                      size="md"
                      icon={Plus}
                      iconPosition="right"
                      gradient
                      fullWidth
                      onClick={() => {
                        onShowCreateAd();
                        setIsMenuOpen(false);
                      }}
                      className="justify-start"
                    >
                      <span>أضف إعلانك مجاناً</span>
                      <span className="mr-auto bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">مجاني</span>
                    </Button>
                    <button
                      onClick={() => {
                        onShowMessages();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center justify-between w-full text-gray-600 hover:text-gray-900 transition-colors px-4 py-3"
                    >
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <MessageSquare className="h-5 w-5" />
                        <span>الرسائل</span>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        onShowProfile();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 space-x-reverse w-full text-gray-600 hover:text-gray-900 transition-colors px-4 py-3"
                    >
                      <User className="h-5 w-5" />
                      <span>الملف الشخصي</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-right text-gray-600 hover:text-gray-900 transition-colors px-4 py-3"
                    >
                      تسجيل الخروج
                    </button>
                  </>
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    gradient
                    fullWidth
                    onClick={() => {
                      onShowAuth();
                      setIsMenuOpen(false);
                    }}
                  >
                    دخول / تسجيل جديد
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;