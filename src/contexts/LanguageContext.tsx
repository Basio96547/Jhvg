import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'ar' | 'en' | 'tr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// الترجمات
const translations = {
  ar: {
    // Header
    'app.name': 'شاري مستعمل',
    'app.tagline': 'موقع البيع والشراء',
    'search.placeholder': 'ابحث في آلاف الإعلانات...',
    'login': 'دخول / تسجيل',
    'add.ad': 'أضف إعلانك مجاناً',
    
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.categories': 'الأقسام',
    'nav.messages': 'الرسائل',
    'nav.notifications': 'الإشعارات',
    'nav.add': 'إضافة عرض',
    
    // Categories
    'category.all': 'كل المناطق',
    'category.nearby': 'القريب',
    'category.cars': 'سيارات',
    'category.electronics': 'إلكترونيات',
    'category.furniture': 'أثاث',
    'category.real_estate': 'عقارات',
    'category.fashion': 'أزياء',
    'category.sports': 'رياضة',
    'category.books': 'كتب',
    'category.other': 'أخرى',
    
    // Ad Details
    'price.currency': 'ل.س',
    'time.minutes_ago': 'قبل {0} دقائق',
    'time.hours_ago': 'قبل {0} ساعات',
    'time.days_ago': 'قبل {0} أيام',
    'time.now': 'الآن',
    
    // Cities
    'city.damascus': 'دمشق',
    'city.aleppo': 'حلب',
    'city.homs': 'حمص',
    'city.hama': 'حماة',
    'city.lattakia': 'اللاذقية',
    'city.tartous': 'طرطوس',
    'city.daraa': 'درعا',
    'city.deir_ezzor': 'دير الزور',
    'city.raqqa': 'الرقة',
    'city.qamishli': 'القامشلي',
    'city.hasaka': 'الحسكة',
    
    // Common
    'view': 'عرض',
    'contact': 'تواصل',
    'share': 'مشاركة',
    'favorite': 'المفضلة',
    'featured': 'مميز',
    'new': 'جديد',
    'used': 'مستعمل',
    'excellent': 'ممتاز',
    'good': 'جيد',
    'fair': 'مقبول',
  },
  
  en: {
    // Header
    'app.name': 'Shari Mostaamal',
    'app.tagline': 'Buy & Sell Platform',
    'search.placeholder': 'Search thousands of ads...',
    'login': 'Login / Register',
    'add.ad': 'Post Your Ad Free',
    
    // Navigation
    'nav.home': 'Home',
    'nav.categories': 'Categories',
    'nav.messages': 'Messages',
    'nav.notifications': 'Notifications',
    'nav.add': 'Add Listing',
    
    // Categories
    'category.all': 'All Areas',
    'category.nearby': 'Nearby',
    'category.cars': 'Cars',
    'category.electronics': 'Electronics',
    'category.furniture': 'Furniture',
    'category.real_estate': 'Real Estate',
    'category.fashion': 'Fashion',
    'category.sports': 'Sports',
    'category.books': 'Books',
    'category.other': 'Other',
    
    // Ad Details
    'price.currency': 'SYP',
    'time.minutes_ago': '{0} minutes ago',
    'time.hours_ago': '{0} hours ago',
    'time.days_ago': '{0} days ago',
    'time.now': 'now',
    
    // Cities
    'city.damascus': 'Damascus',
    'city.aleppo': 'Aleppo',
    'city.homs': 'Homs',
    'city.hama': 'Hama',
    'city.lattakia': 'Lattakia',
    'city.tartous': 'Tartous',
    'city.daraa': 'Daraa',
    'city.deir_ezzor': 'Deir Ezzor',
    'city.raqqa': 'Raqqa',
    'city.qamishli': 'Qamishli',
    'city.hasaka': 'Hasaka',
    
    // Common
    'view': 'View',
    'contact': 'Contact',
    'share': 'Share',
    'favorite': 'Favorite',
    'featured': 'Featured',
    'new': 'New',
    'used': 'Used',
    'excellent': 'Excellent',
    'good': 'Good',
    'fair': 'Fair',
  },
  
  tr: {
    // Header
    'app.name': 'Shari Mostaamal',
    'app.tagline': 'Alım Satım Platformu',
    'search.placeholder': 'Binlerce ilana göz atın...',
    'login': 'Giriş / Kayıt',
    'add.ad': 'Ücretsiz İlan Ver',
    
    // Navigation
    'nav.home': 'Ana Sayfa',
    'nav.categories': 'Kategoriler',
    'nav.messages': 'Mesajlar',
    'nav.notifications': 'Bildirimler',
    'nav.add': 'İlan Ekle',
    
    // Categories
    'category.all': 'Tüm Bölgeler',
    'category.nearby': 'Yakın',
    'category.cars': 'Arabalar',
    'category.electronics': 'Elektronik',
    'category.furniture': 'Mobilya',
    'category.real_estate': 'Emlak',
    'category.fashion': 'Moda',
    'category.sports': 'Spor',
    'category.books': 'Kitaplar',
    'category.other': 'Diğer',
    
    // Ad Details
    'price.currency': 'TL',
    'time.minutes_ago': '{0} dakika önce',
    'time.hours_ago': '{0} saat önce',
    'time.days_ago': '{0} gün önce',
    'time.now': 'şimdi',
    
    // Cities
    'city.damascus': 'Şam',
    'city.aleppo': 'Halep',
    'city.homs': 'Humus',
    'city.hama': 'Hama',
    'city.lattakia': 'Lazkiye',
    'city.tartous': 'Tartus',
    'city.daraa': 'Dera',
    'city.deir_ezzor': 'Deyr ez-Zor',
    'city.raqqa': 'Rakka',
    'city.qamishli': 'Kamışlı',
    'city.hasaka': 'Haseke',
    
    // Common
    'view': 'Görüntüle',
    'contact': 'İletişim',
    'share': 'Paylaş',
    'favorite': 'Favori',
    'featured': 'Öne Çıkan',
    'new': 'Yeni',
    'used': 'İkinci El',
    'excellent': 'Mükemmel',
    'good': 'İyi',
    'fair': 'Orta',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['ar', 'en', 'tr'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key: string, ...args: string[]): string => {
    let translation = translations[language][key] || key;
    
    // Replace placeholders {0}, {1}, etc. with provided arguments
    args.forEach((arg, index) => {
      translation = translation.replace(`{${index}}`, arg);
    });
    
    return translation;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};