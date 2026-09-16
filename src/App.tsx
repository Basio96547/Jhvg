import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AdService } from './services/adService';
import { FavoriteService } from './services/favoriteService';
import { MessageService } from './services/messageService';
import Header from './components/Layout/Header';
import MobileLayout from './components/Layout/MobileLayout';
import CategoryNav from './components/Layout/CategoryNav';
import SortFilter from './components/Ads/SortFilter';
import AdGrid from './components/Ads/AdGrid';
import AdGridWithLayout from './components/Ads/AdGridWithLayout';
import AdsCarousel from './components/Ads/AdsCarousel';
import AdDetail from './components/Ads/AdDetail';
import CreateAd from './components/Ads/CreateAd';
import PhoneAuthModal from './components/Auth/PhoneAuthModal';
import UserProfile from './components/Profile/UserProfile';
import MessageList from './components/Messages/MessageList';
import MessageView from './components/Messages/MessageView';
import MessagesPage from './components/Messages/MessagesPage';
import FavoritesList from './components/Favorites/FavoritesList';
import MyAdsList from './components/MyAds/MyAdsList';
import QuickActions from './components/Layout/QuickActions';
import FloatingHelp from './components/Layout/FloatingHelp';
import SmartSearchBox from './components/Search/SmartSearchBox';
import PopularSearches from './components/Search/PopularSearches';
import SearchFilters from './components/Search/SearchFilters';
import { Ad, Conversation, Message, SortOption, Comment } from './types';
import { mockAds } from './data/mockData';
import { SmartSearch, SearchFilters as ISearchFilters } from './utils/smartSearch';
import { TrendingUp, Users, Shield, Clock, Search, Plus, MessageCircle, Heart } from 'lucide-react';

// Hook to detect mobile devices
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};

function App() {
  const isMobile = useIsMobile();
  // State management
  const [ads, setAds] = useState<Ad[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCreateAd, setShowCreateAd] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showMyAds, setShowMyAds] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showQuickSearch, setShowQuickSearch] = useState(false);
  const [showMessagesPage, setShowMessagesPage] = useState(false);
  const [searchFilters, setSearchFilters] = useState<ISearchFilters>({});
  
  // Local storage state
  const [favorites, setFavorites] = useState<string[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Smart search instance
  const smartSearch = SmartSearch.getInstance();

  // تحميل البيانات عند بدء التطبيق
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // تحميل الإعلانات
      const adsData = await AdService.getAds({
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        search: searchQuery || undefined,
      });
      setAds(adsData);
      
    } catch (error) {
      console.error('Error loading data:', error);
      // استخدام البيانات الوهمية في حالة الخطأ
      setAds(mockAds);
    } finally {
      setLoading(false);
    }
  };

  // تحميل البيانات عند تغيير الفئة أو البحث
  useEffect(() => {
    if (!loading) {
      loadAds();
    }
  }, [selectedCategory, searchQuery]);

  const loadAds = async () => {
    try {
      const adsData = await AdService.getAds({
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        search: searchQuery || undefined,
      });
      setAds(adsData);
    } catch (error) {
      console.error('Error loading ads:', error);
    }
  };

  // Sort ads function
  const sortAds = (adsToSort: Ad[], sortOption: SortOption): Ad[] => {
    const sorted = [...adsToSort];
    
    switch (sortOption) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'most-viewed':
        return sorted.sort((a, b) => b.views - a.views);
      case 'highest-rated':
        return sorted.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
      default:
        return sorted;
    }
  };

  // Filter and sort ads
  const filteredAndSortedAds = sortAds(
    smartSearch.advancedSearch(
      searchQuery,
      ads.filter(ad => {
        const matchesCategory = selectedCategory === 'all' || ad.category === selectedCategory;
        return matchesCategory && ad.status === 'active';
      }),
      searchFilters
    ),
    sortBy
  );

  // Get favorite ads
  const favoriteAds = ads.filter(ad => favorites.includes(ad.id));

  // Get user's ads (mock - in real app would filter by user ID)
  const userAds = ads.filter(ad => ad.userId === '1'); // Mock current user ID

  // Get featured ads for carousel
  const featuredAds = ads.filter(ad => ad.featured);

  // Get actual messages count
  const actualMessagesCount = conversations.length;
  const unreadMessagesCount = conversations.filter(conv => 
    conv.messages.some(msg => msg.senderId !== '1' && !msg.isRead)
  ).length;
  // Quick search suggestions
  const getSearchSuggestions = () => {
    if (!searchQuery) return [];
    return ads
      .filter(ad => 
        ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 5)
      .map(ad => ({ id: ad.id, title: ad.title, category: ad.category }));
  };

  // Handlers
  const handleCreateAd = (newAd: Ad) => {
    setAds(prev => [newAd, ...prev]);
    
    // Show success message
    alert('تم إضافة الإعلان بنجاح! 🎉');
  };

  const handleUpdateAd = (updatedAd: Ad) => {
    setAds(prev => prev.map(ad => ad.id === updatedAd.id ? updatedAd : ad));
  };

  const handleToggleFavorite = (adId: string) => {
    // سيتم تنفيذ هذا لاحقاً مع قاعدة البيانات
    console.log('Toggle favorite:', adId);
  };

  const handleStartConversation = (ad: Ad) => {
    const existingConversation = conversations.find(c => 
      c.adId === ad.id && (c.buyerId === '1' || c.sellerId === '1')
    );

    if (existingConversation) {
      setSelectedConversation(existingConversation);
      setShowMessages(false);
    } else {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        adId: ad.id,
        buyerId: '1', // Mock current user ID
        sellerId: ad.userId,
        messages: [{
          id: Date.now().toString(),
          conversationId: Date.now().toString(),
          senderId: '1',
          content: `مرحباً! أنا مهتم بـ ${ad.title}. هل ما زال متوفراً؟`,
          timestamp: new Date().toISOString(),
        }],
        lastMessage: `مرحباً! أنا مهتم بـ ${ad.title}. هل ما زال متوفراً؟`,
        lastMessageTime: new Date().toISOString(),
        ad,
        buyer: mockAds[0].user,
        seller: ad.user,
      };

      setConversations(prev => [newConversation, ...prev]);
      setSelectedConversation(newConversation);
      setShowMessages(false);
    }
    setSelectedAd(null);
  };

  const handleSendMessage = (conversationId: string, content: string, offer?: number, images?: string[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      conversationId,
      senderId: '1', // Mock current user ID
      content,
      timestamp: new Date().toISOString(),
      offer,
      images,
      isRead: false,
    };

    setConversations(prev => prev.map(conversation => {
      if (conversation.id === conversationId) {
        return {
          ...conversation,
          messages: [...conversation.messages, newMessage],
          lastMessage: content || (images && images.length > 0 ? `📷 ${images.length} صورة` : 'رسالة'),
          lastMessageTime: newMessage.timestamp,
        };
      }
      return conversation;
    }));
  };

  const handleDeleteAd = (adId: string) => {
    setAds(prev => prev.filter(ad => ad.id !== adId));
    setFavorites(prev => prev.filter(id => id !== adId));
  };

  const handleEditAd = (ad: Ad) => {
    setSelectedAd(ad);
    setShowCreateAd(true);
    setShowMyAds(false);
  };

  const handleAddComment = (adId: string, content: string, rating?: number) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      adId,
      userId: '1', // Mock current user ID
      content,
      rating,
      createdAt: new Date().toISOString(),
      user: mockAds[0].user, // Mock user data
    };

    setAds(prev => prev.map(ad => {
      if (ad.id === adId) {
        const updatedComments = [...(ad.comments || []), newComment];
        const ratings = updatedComments.filter(c => c.rating).map(c => c.rating!);
        const averageRating = ratings.length > 0 
          ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
          : undefined;

        return {
          ...ad,
          comments: updatedComments,
          commentsCount: updatedComments.length,
          averageRating,
        };
      }
      return ad;
    }));
  };

  const handleReplyToComment = (adId: string, commentId: string, content: string) => {
    if (!isAuthenticated) {
      alert('يجب تسجيل الدخول أولاً للرد على التعليق');
      setShowAuthModal(true);
      return;
    }
    
    const reply: Comment = {
      id: Date.now().toString(),
      adId,
      userId: '1', // Mock current user ID
      content,
      createdAt: new Date().toISOString(),
      user: mockAds[0].user, // Mock user data
    };

    setAds(prev => prev.map(ad => {
      if (ad.id === adId) {
        const updatedComments = (ad.comments || []).map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), reply]
            };
          }
          return comment;
        });

        return {
          ...ad,
          comments: updatedComments,
        };
      }
      return ad;
    }));
  };

  // Handle smart search
  const handleSmartSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      smartSearch.addToHistory(query);
    }
  };

  // Handle mobile search
  const handleMobileSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      smartSearch.addToHistory(query.trim());
    }
  };

  // Clear search filters
  const clearSearchFilters = () => {
    setSearchFilters({});
  };
  // Quick actions
  const quickActions = [
    {
      icon: Plus,
      label: 'إضافة إعلان',
      action: () => setShowCreateAd(true),
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      icon: Search,
      label: 'بحث سريع',
      action: () => setShowQuickSearch(true),
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      icon: Heart,
      label: 'المفضلة',
      action: () => setShowFavorites(true),
      color: 'bg-red-600 hover:bg-red-700',
      badge: favorites.length,
    },
    {
      icon: MessageCircle,
      label: 'الرسائل',
      action: () => setShowMessages(true),
      color: 'bg-purple-600 hover:bg-purple-700',
      badge: conversations.length,
    },
  ];

  // Populate conversations with ad and user data
  const populatedConversations = conversations.map(conversation => ({
    ...conversation,
    ad: ads.find(ad => ad.id === conversation.adId),
    buyer: mockAds[0].user, // Mock data
    seller: ads.find(ad => ad.id === conversation.adId)?.user,
  }));

  return (
    <LanguageProvider>
      <AuthProvider>
        <>
        {isMobile ? (
          <MobileLayout
            ads={filteredAndSortedAds}
            onAdClick={setSelectedAd}
            onShowAuth={() => setShowAuthModal(true)}
            onShowCreateAd={() => setShowCreateAd(true)}
            onShowMessages={() => setShowMessagesPage(true)}
            onShowProfile={() => setShowProfile(true)}
            messagesCount={actualMessagesCount}
            unreadCount={unreadMessagesCount}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        ) : (
          <div className="min-h-screen bg-gray-50" dir="rtl">
        <Header
          onShowAuth={() => setShowAuthModal(true)}
          onShowCreateAd={() => setShowCreateAd(true)}
          onShowProfile={() => setShowProfile(true)}
          onShowMessages={() => setShowMessagesPage(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          suggestions={getSearchSuggestions()}
          showSuggestions={showQuickSearch}
          onCloseSuggestions={() => setShowQuickSearch(false)}
        />
        
        <CategoryNav
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12 bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-2xl p-8 md:p-12 arabic-text">
            <h1 className="text-3xl md:text-5xl font-arabic-display font-bold mb-4 md:mb-6">
              شاري مستعمل
            </h1>
            <p className="text-lg md:text-xl mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed font-arabic-body arabic-spacing">
              أكبر موقع للبيع والشراء في سوريا - اكتشف عروضاً مذهلة على منتجات عالية الجودة
              من بائعين موثوقين في جميع أنحاء سوريا
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => setShowCreateAd(true)}
                className="btn-haraj-secondary text-base md:text-lg px-6 md:px-8 py-3 md:py-4"
              >
                أضف إعلانك مجاناً
              </button>
              <button 
                onClick={() => document.getElementById('ads-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-blue-700 font-medium px-6 md:px-8 py-3 md:py-4 rounded-lg hover:bg-gray-100 transition-colors text-base md:text-lg"
              >
                تصفح الإعلانات
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
            <div className="text-center bg-white rounded-xl p-4 md:p-6 shadow-sm">
              <div className="text-2xl md:text-4xl font-arabic-display font-bold text-blue-700 mb-2 arabic-numbers">{ads.length.toLocaleString('ar-SY')}+</div>
              <div className="text-gray-600 font-arabic-body font-medium text-sm md:text-base">إعلان نشط</div>
            </div>
            <div className="text-center bg-white rounded-xl p-4 md:p-6 shadow-sm">
              <div className="text-2xl md:text-4xl font-arabic-display font-bold text-green-600 mb-2 arabic-numbers">95%</div>
              <div className="text-gray-600 font-arabic-body font-medium text-sm md:text-base">عملاء راضون</div>
            </div>
            <div className="text-center bg-white rounded-xl p-4 md:p-6 shadow-sm">
              <div className="text-2xl md:text-4xl font-arabic-display font-bold text-orange-600 mb-2 arabic-numbers">24/7</div>
              <div className="text-gray-600 font-arabic-body font-medium text-sm md:text-base">دعم العملاء</div>
            </div>
            <div className="text-center bg-white rounded-xl p-4 md:p-6 shadow-sm">
              <div className="text-2xl md:text-4xl font-arabic-display font-bold text-purple-600 mb-2 arabic-numbers">100%</div>
              <div className="text-gray-600 font-arabic-body font-medium text-sm md:text-base">إعلانات مجانية</div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-12">
            <div className="bg-white rounded-xl p-4 md:p-6 text-center shadow-sm">
              <TrendingUp className="h-8 md:h-12 w-8 md:w-12 text-blue-700 mx-auto mb-3 md:mb-4" />
              <h3 className="font-arabic-display font-semibold text-gray-900 mb-2 text-sm md:text-base">نمو سريع</h3>
              <p className="text-gray-600 font-arabic-body text-xs md:text-sm arabic-spacing">آلاف الإعلانات الجديدة يومياً</p>
            </div>
            <div className="bg-white rounded-xl p-4 md:p-6 text-center shadow-sm">
              <Users className="h-8 md:h-12 w-8 md:w-12 text-green-600 mx-auto mb-3 md:mb-4" />
              <h3 className="font-arabic-display font-semibold text-gray-900 mb-2 text-sm md:text-base">مجتمع كبير</h3>
              <p className="text-gray-600 font-arabic-body text-xs md:text-sm arabic-spacing">ملايين المستخدمين الموثوقين</p>
            </div>
            <div className="bg-white rounded-xl p-4 md:p-6 text-center shadow-sm">
              <Shield className="h-8 md:h-12 w-8 md:w-12 text-orange-600 mx-auto mb-3 md:mb-4" />
              <h3 className="font-arabic-display font-semibold text-gray-900 mb-2 text-sm md:text-base">أمان وثقة</h3>
              <p className="text-gray-600 font-arabic-body text-xs md:text-sm arabic-spacing">نظام تقييم وحماية المستخدمين</p>
            </div>
            <div className="bg-white rounded-xl p-4 md:p-6 text-center shadow-sm">
              <Clock className="h-8 md:h-12 w-8 md:w-12 text-purple-600 mx-auto mb-3 md:mb-4" />
              <h3 className="font-arabic-display font-semibold text-gray-900 mb-2 text-sm md:text-base">سرعة في البيع</h3>
              <p className="text-gray-600 font-arabic-body text-xs md:text-sm arabic-spacing">بيع سريع وفعال لمنتجاتك</p>
            </div>
          </div>

          {/* Quick Actions */}
          <QuickActions
            actions={quickActions}
            onShowFavorites={() => setShowFavorites(true)}
            onShowMyAds={() => setShowMyAds(true)}
            onShowMessages={() => setShowMessagesPage(true)}
            favoritesCount={0} // إخفاء العداد حتى يتم إضافة مفضلة فعلية
            userAdsCount={0}   // إخفاء العداد حتى يتم إضافة إعلانات فعلية
            messagesCount={actualMessagesCount}
          />

          {/* Featured Ads Carousel */}
          {featuredAds.length > 0 && (
            <AdsCarousel
              ads={featuredAds}
              title="الإعلانات المميزة ⭐"
              onAdClick={setSelectedAd}
              autoPlay={true}
              itemsPerView={1}
              aspectRatio="photo"
              className="mb-8"
            />
          )}

          {/* Smart Search Section */}
          <div className="mb-8 space-y-6">
            <SmartSearchBox
              searchQuery={searchQuery}
              onSearchChange={handleSmartSearch}
              ads={ads}
              onAdClick={setSelectedAd}
              className="max-w-4xl mx-auto"
            />
            
            {!searchQuery && (
              <PopularSearches
                onSearchClick={handleSmartSearch}
                className="max-w-4xl mx-auto"
              />
            )}
            
            <SearchFilters
              filters={searchFilters}
              onFiltersChange={setSearchFilters}
              onClear={clearSearchFilters}
              className="max-w-4xl mx-auto"
            />
          </div>
          {/* Ads Section */}
          <div id="ads-section">
            <SortFilter
              sortBy={sortBy}
              onSortChange={setSortBy}
              totalAds={filteredAndSortedAds.length}
            />

            <AdGridWithLayout ads={filteredAndSortedAds} onAdClick={setSelectedAd} />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8 md:py-12 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
              <div>
                <h3 className="text-lg md:text-xl font-arabic-display font-bold mb-4">شاري مستعمل</h3>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base font-arabic-body arabic-spacing">
                  موقع البيع والشراء الأول في سوريا. نربط البائعين والمشترين في بيئة آمنة وموثوقة.
                </p>
              </div>
              <div>
                <h4 className="font-arabic-display font-semibold mb-4">روابط سريعة</h4>
                <ul className="space-y-2 text-gray-300 text-sm md:text-base font-arabic-body">
                  <li><a href="#" className="hover:text-white transition-colors">عن الموقع</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">شروط الاستخدام</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">اتصل بنا</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-arabic-display font-semibold mb-4">الفئات الرئيسية</h4>
                <ul className="space-y-2 text-gray-300 text-sm md:text-base font-arabic-body">
                  <li><a href="#" className="hover:text-white transition-colors">سيارات</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">عقارات</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">إلكترونيات</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">أثاث</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-arabic-display font-semibold mb-4">تابعنا</h4>
                <div className="flex space-x-4 space-x-reverse font-arabic-body">
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">فيسبوك</a>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">تويتر</a>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">إنستغرام</a>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-gray-300">
              <p className="font-arabic-body">&copy; 2024 شاري مستعمل. جميع الحقوق محفوظة.</p>
            </div>
          </div>
        </footer>

        {/* Floating Help */}
        <FloatingHelp />
          </div>
        )}

        {/* Modals */}
        {showAuthModal && (
          <PhoneAuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
          />
        )}

        {showCreateAd && (
          <CreateAd
            onClose={() => {
              setShowCreateAd(false);
              setSelectedAd(null);
            }}
            onCreateAd={handleCreateAd}
            editingAd={selectedAd}
            onUpdateAd={handleUpdateAd}
          />
        )}

        {showProfile && (
          <UserProfile onClose={() => setShowProfile(false)} />
        )}

        {showFavorites && (
          <FavoritesList
            onClose={() => setShowFavorites(false)}
            favorites={favoriteAds}
            onAdClick={setSelectedAd}
            onRemoveFavorite={handleToggleFavorite}
          />
        )}

        {showMyAds && (
          <MyAdsList
            onClose={() => setShowMyAds(false)}
            userAds={userAds}
            onCreateAd={() => {
              setShowMyAds(false);
              setShowCreateAd(true);
            }}
            onEditAd={handleEditAd}
            onDeleteAd={handleDeleteAd}
            onAdClick={setSelectedAd}
          />
        )}

        {showMessagesPage && (
          <MessagesPage
            onClose={() => setShowMessagesPage(false)}
            conversations={populatedConversations}
            onSendMessage={handleSendMessage}
            onSelectConversation={setSelectedConversation}
          />
        )}

        {showMessages && !selectedConversation && (
          <MessageList
            onClose={() => setShowMessages(false)}
            conversations={populatedConversations}
            onSelectConversation={setSelectedConversation}
          />
        )}

        {selectedConversation && (
          <MessageView
            conversation={selectedConversation}
            onClose={() => {
              setSelectedConversation(null);
              setShowMessages(false);
            }}
            onBack={() => {
              setSelectedConversation(null);
              setShowMessages(true);
            }}
            onSendMessage={handleSendMessage}
          />
        )}

        {selectedAd && (
          <AdDetail
            ad={selectedAd}
            onClose={() => setSelectedAd(null)}
            onStartConversation={handleStartConversation}
            onAddComment={handleAddComment}
            onReplyToComment={handleReplyToComment}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={favorites.includes(selectedAd.id)}
          />
        )}
        </>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;