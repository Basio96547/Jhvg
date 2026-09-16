// نظام البحث الذكي مع تصحيح الأخطاء الإملائية
export class SmartSearch {
  private static instance: SmartSearch;
  private searchHistory: string[] = [];
  private popularSearches: { [key: string]: number } = {};
  private synonyms: { [key: string]: string[] } = {
    'جوال': ['هاتف', 'موبايل', 'تليفون'],
    'سيارة': ['عربية', 'مركبة', 'سيارات'],
    'بيت': ['منزل', 'دار', 'شقة'],
    'كمبيوتر': ['حاسوب', 'لابتوب', 'كومبيوتر'],
    'تلفزيون': ['تلفاز', 'شاشة', 'تليفزيون'],
    'ثلاجة': ['براد', 'فريزر'],
    'غسالة': ['غسيل', 'مغسلة'],
    'مكيف': ['تكييف', 'مبرد'],
    'دراجة': ['بايسكل', 'عجلة'],
    'كتاب': ['مجلة', 'رواية'],
  };

  private commonMisspellings: { [key: string]: string } = {
    'ايفون': 'آيفون',
    'سامسونغ': 'سامسونج',
    'كمبيوتر': 'كمبيوتر',
    'تليفون': 'تليفون',
    'موبايل': 'موبايل',
    'لابتوب': 'لابتوب',
    'تابلت': 'تابلت',
    'بلايستيشن': 'بلايستيشن',
    'اكسبوكس': 'إكسبوكس',
    'نينتندو': 'نينتندو',
  };

  private constructor() {
    this.loadSearchHistory();
    this.loadPopularSearches();
  }

  public static getInstance(): SmartSearch {
    if (!SmartSearch.instance) {
      SmartSearch.instance = new SmartSearch();
    }
    return SmartSearch.instance;
  }

  // تصحيح الأخطاء الإملائية
  public correctSpelling(query: string): string {
    let corrected = query;
    
    // تصحيح الأخطاء الشائعة
    Object.keys(this.commonMisspellings).forEach(mistake => {
      const correction = this.commonMisspellings[mistake];
      const regex = new RegExp(mistake, 'gi');
      corrected = corrected.replace(regex, correction);
    });

    return corrected;
  }

  // حساب المسافة بين النصوص (Levenshtein Distance)
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  // اقتراح تصحيحات للكلمات
  public suggestCorrections(word: string, dictionary: string[]): string[] {
    const suggestions: { word: string; distance: number }[] = [];
    
    dictionary.forEach(dictWord => {
      const distance = this.levenshteinDistance(word.toLowerCase(), dictWord.toLowerCase());
      if (distance <= 2) { // السماح بخطأين كحد أقصى
        suggestions.push({ word: dictWord, distance });
      }
    });
    
    return suggestions
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5)
      .map(s => s.word);
  }

  // البحث الذكي مع المرادفات
  public expandQuery(query: string): string[] {
    const words = query.toLowerCase().split(' ');
    const expandedQueries: Set<string> = new Set([query]);
    
    words.forEach(word => {
      // البحث عن المرادفات
      Object.keys(this.synonyms).forEach(key => {
        if (key === word || this.synonyms[key].includes(word)) {
          const synonymList = [key, ...this.synonyms[key]];
          synonymList.forEach(synonym => {
            if (synonym !== word) {
              const newQuery = query.replace(new RegExp(word, 'gi'), synonym);
              expandedQueries.add(newQuery);
            }
          });
        }
      });
    });
    
    return Array.from(expandedQueries);
  }

  // الحصول على اقتراحات البحث
  public getSuggestions(query: string, ads: any[]): SearchSuggestion[] {
    if (!query || query.length < 2) return [];
    
    const suggestions: SearchSuggestion[] = [];
    const queryLower = query.toLowerCase();
    
    // تصحيح الإملاء أولاً
    const correctedQuery = this.correctSpelling(query);
    if (correctedQuery !== query) {
      suggestions.push({
        type: 'correction',
        text: correctedQuery,
        originalQuery: query,
        count: 0,
        icon: '✏️'
      });
    }
    
    // اقتراحات من تاريخ البحث
    this.searchHistory
      .filter(search => search.toLowerCase().includes(queryLower))
      .slice(0, 3)
      .forEach(search => {
        suggestions.push({
          type: 'history',
          text: search,
          count: 0,
          icon: '🕒'
        });
      });
    
    // اقتراحات من البحثات الشائعة
    Object.keys(this.popularSearches)
      .filter(search => search.toLowerCase().includes(queryLower))
      .sort((a, b) => this.popularSearches[b] - this.popularSearches[a])
      .slice(0, 3)
      .forEach(search => {
        suggestions.push({
          type: 'popular',
          text: search,
          count: this.popularSearches[search],
          icon: '🔥'
        });
      });
    
    // اقتراحات من عناوين الإعلانات
    const titleSuggestions = ads
      .filter(ad => ad.title.toLowerCase().includes(queryLower))
      .slice(0, 5)
      .map(ad => ({
        type: 'product' as const,
        text: ad.title,
        count: 1,
        icon: '📦',
        adId: ad.id,
        price: ad.price,
        image: ad.images[0]
      }));
    
    suggestions.push(...titleSuggestions);
    
    // اقتراحات من الفئات
    const categories = ['سيارات', 'إلكترونيات', 'أثاث', 'عقارات', 'أزياء'];
    const categorySuggestions = categories
      .filter(category => category.toLowerCase().includes(queryLower))
      .map(category => ({
        type: 'category' as const,
        text: category,
        count: ads.filter(ad => ad.category === category).length,
        icon: '📂'
      }));
    
    suggestions.push(...categorySuggestions);
    
    // إزالة المكررات وترتيب النتائج
    const uniqueSuggestions = suggestions.filter((suggestion, index, self) => 
      index === self.findIndex(s => s.text === suggestion.text && s.type === suggestion.type)
    );
    
    return uniqueSuggestions.slice(0, 8);
  }

  // إضافة بحث إلى التاريخ
  public addToHistory(query: string): void {
    if (!query || query.length < 2) return;
    
    // إزالة البحث إذا كان موجوداً مسبقاً
    this.searchHistory = this.searchHistory.filter(search => search !== query);
    
    // إضافة البحث في المقدمة
    this.searchHistory.unshift(query);
    
    // الاحتفاظ بآخر 50 بحث فقط
    this.searchHistory = this.searchHistory.slice(0, 50);
    
    // تحديث البحثات الشائعة
    this.popularSearches[query] = (this.popularSearches[query] || 0) + 1;
    
    // حفظ في التخزين المحلي
    this.saveSearchHistory();
    this.savePopularSearches();
  }

  // مسح تاريخ البحث
  public clearHistory(): void {
    this.searchHistory = [];
    localStorage.removeItem('searchHistory');
  }

  // الحصول على البحثات الشائعة
  public getPopularSearches(limit: number = 10): string[] {
    return Object.keys(this.popularSearches)
      .sort((a, b) => this.popularSearches[b] - this.popularSearches[a])
      .slice(0, limit);
  }

  // حفظ تاريخ البحث
  private saveSearchHistory(): void {
    localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
  }

  // تحميل تاريخ البحث
  private loadSearchHistory(): void {
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      this.searchHistory = JSON.parse(saved);
    }
  }

  // حفظ البحثات الشائعة
  private savePopularSearches(): void {
    localStorage.setItem('popularSearches', JSON.stringify(this.popularSearches));
  }

  // تحميل البحثات الشائعة
  private loadPopularSearches(): void {
    const saved = localStorage.getItem('popularSearches');
    if (saved) {
      this.popularSearches = JSON.parse(saved);
    }
  }

  // البحث المتقدم مع الفلاتر
  public advancedSearch(query: string, ads: any[], filters: SearchFilters = {}): any[] {
    let results = ads;
    
    // تطبيق البحث النصي
    if (query) {
      const expandedQueries = this.expandQuery(query);
      const correctedQuery = this.correctSpelling(query);
      if (correctedQuery !== query) {
        expandedQueries.push(correctedQuery);
      }
      
      results = results.filter(ad => {
        return expandedQueries.some(expandedQuery => 
          ad.title.toLowerCase().includes(expandedQuery.toLowerCase()) ||
          ad.description.toLowerCase().includes(expandedQuery.toLowerCase()) ||
          ad.category.toLowerCase().includes(expandedQuery.toLowerCase()) ||
          ad.user?.name.toLowerCase().includes(expandedQuery.toLowerCase())
        );
      });
    }
    
    // تطبيق فلاتر السعر
    if (filters.minPrice !== undefined) {
      results = results.filter(ad => ad.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      results = results.filter(ad => ad.price <= filters.maxPrice!);
    }
    
    // تطبيق فلتر الحالة
    if (filters.condition) {
      results = results.filter(ad => ad.condition === filters.condition);
    }
    
    // تطبيق فلتر الموقع
    if (filters.location) {
      results = results.filter(ad => 
        ad.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }
    
    // تطبيق فلتر التاريخ
    if (filters.dateRange) {
      const now = new Date();
      const daysAgo = new Date(now.getTime() - filters.dateRange * 24 * 60 * 60 * 1000);
      results = results.filter(ad => new Date(ad.createdAt) >= daysAgo);
    }
    
    return results;
  }
}

export interface SearchSuggestion {
  type: 'correction' | 'history' | 'popular' | 'product' | 'category';
  text: string;
  count: number;
  icon: string;
  originalQuery?: string;
  adId?: string;
  price?: number;
  image?: string;
}

export interface SearchFilters {
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  location?: string;
  dateRange?: number; // days
}