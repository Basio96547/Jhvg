import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp, Package, Folder, Edit3, Zap } from 'lucide-react';
import { SmartSearch, SearchSuggestion } from '../../utils/smartSearch';
import { Ad } from '../../types';

interface SmartSearchBoxProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  ads: Ad[];
  onAdClick?: (ad: Ad) => void;
  placeholder?: string;
  className?: string;
}

const SmartSearchBox: React.FC<SmartSearchBoxProps> = ({
  searchQuery,
  onSearchChange,
  ads,
  onAdClick,
  placeholder = "ابحث في آلاف الإعلانات...",
  className = ""
}) => {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const smartSearch = SmartSearch.getInstance();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2) {
        setIsLoading(true);
        const newSuggestions = smartSearch.getSuggestions(searchQuery, ads);
        setSuggestions(newSuggestions);
        setIsLoading(false);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
      setSelectedIndex(-1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, ads]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      smartSearch.addToHistory(searchQuery.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'product' && suggestion.adId && onAdClick) {
      const ad = ads.find(a => a.id === suggestion.adId);
      if (ad) {
        onAdClick(ad);
        setShowSuggestions(false);
        return;
      }
    }
    
    onSearchChange(suggestion.text);
    smartSearch.addToHistory(suggestion.text);
    setShowSuggestions(false);
    searchRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else if (searchQuery) {
          smartSearch.addToHistory(searchQuery);
          setShowSuggestions(false);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(e.relatedTarget as Node)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    }, 200);
  };

  const clearSearch = () => {
    onSearchChange('');
    setShowSuggestions(false);
    searchRef.current?.focus();
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'correction': return <Edit3 className="h-4 w-4 text-orange-500" />;
      case 'history': return <Clock className="h-4 w-4 text-gray-500" />;
      case 'popular': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'product': return <Package className="h-4 w-4 text-blue-500" />;
      case 'category': return <Folder className="h-4 w-4 text-purple-500" />;
      default: return <Search className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSuggestionLabel = (type: string) => {
    switch (type) {
      case 'correction': return 'تصحيح إملائي';
      case 'history': return 'من تاريخ البحث';
      case 'popular': return 'بحث شائع';
      case 'product': return 'منتج';
      case 'category': return 'فئة';
      default: return '';
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

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 space-x-reverse">
          <Search className="h-5 w-5 text-gray-400" />
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
          )}
        </div>
        
        <input
          ref={searchRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full pr-16 pl-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right text-base transition-all shadow-sm hover:shadow-md bg-white"
          dir="rtl"
        />
        
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        
        <button 
          onClick={handleSearch}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all text-sm font-medium shadow-md"
        >
          <Zap className="h-4 w-4" />
        </button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto"
        >
          <div className="p-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.type}-${suggestion.text}-${index}`}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`w-full px-4 py-3 text-right hover:bg-blue-50 transition-colors rounded-lg flex items-center justify-between group ${
                  index === selectedIndex ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-center space-x-3 space-x-reverse flex-1 min-w-0">
                  {suggestion.type === 'product' && suggestion.image ? (
                    <img
                      src={suggestion.image}
                      alt={suggestion.text}
                      className="h-10 w-10 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="flex-shrink-0">
                      {getSuggestionIcon(suggestion.type)}
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0 text-right">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {suggestion.originalQuery && (
                          <span className="text-gray-500 line-through mr-2">
                            {suggestion.originalQuery}
                          </span>
                        )}
                        {suggestion.text}
                      </p>
                      {suggestion.price && (
                        <span className="text-sm font-bold text-blue-600 mr-2">
                          {formatPrice(suggestion.price)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">
                        {getSuggestionLabel(suggestion.type)}
                      </span>
                      {suggestion.count > 0 && (
                        <span className="text-xs text-gray-400">
                          {suggestion.type === 'popular' 
                            ? `${suggestion.count} بحث`
                            : suggestion.type === 'category'
                            ? `${suggestion.count} إعلان`
                            : ''
                          }
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          <div className="border-t border-gray-100 p-3 bg-gray-50 rounded-b-xl">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>استخدم ↑↓ للتنقل، Enter للاختيار</span>
              <button
                onClick={() => smartSearch.clearHistory()}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                مسح التاريخ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartSearchBox;