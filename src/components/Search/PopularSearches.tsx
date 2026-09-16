import React from 'react';
import { TrendingUp, Search } from 'lucide-react';
import { SmartSearch } from '../../utils/smartSearch';

interface PopularSearchesProps {
  onSearchClick: (query: string) => void;
  className?: string;
}

const PopularSearches: React.FC<PopularSearchesProps> = ({ 
  onSearchClick, 
  className = "" 
}) => {
  const smartSearch = SmartSearch.getInstance();
  const popularSearches = smartSearch.getPopularSearches(8);

  if (popularSearches.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-100 p-6 ${className}`}>
      <div className="flex items-center space-x-2 space-x-reverse mb-4">
        <div className="p-2 bg-red-100 rounded-lg">
          <TrendingUp className="h-5 w-5 text-red-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">البحثات الشائعة</h3>
        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
          🔥 ترند
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {popularSearches.map((search, index) => (
          <button
            key={search}
            onClick={() => onSearchClick(search)}
            className="group flex items-center space-x-2 space-x-reverse bg-gray-50 hover:bg-blue-50 hover:border-blue-200 border border-gray-200 rounded-lg px-3 py-2 transition-all text-right"
          >
            <Search className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
            <span className="text-sm text-gray-700 group-hover:text-blue-700 font-medium truncate">
              {search}
            </span>
            <div className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold flex-shrink-0">
              {index + 1}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          البحثات الأكثر شيوعاً هذا الأسبوع • يتم التحديث كل ساعة
        </p>
      </div>
    </div>
  );
};

export default PopularSearches;