import React, { useState } from 'react';
import { Filter, X, MapPin, DollarSign, Calendar, Package } from 'lucide-react';
import { SearchFilters as ISearchFilters } from '../../utils/smartSearch';
import { conditions, syrianCities } from '../../data/mockData';

interface SearchFiltersProps {
  filters: ISearchFilters;
  onFiltersChange: (filters: ISearchFilters) => void;
  onClear: () => void;
  className?: string;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFiltersChange,
  onClear,
  className = ""
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key: keyof ISearchFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined
    });
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value !== undefined && value !== '').length;
  };

  const formatPrice = (price: string) => {
    if (!price) return '';
    const num = parseFloat(price.replace(/,/g, ''));
    if (isNaN(num)) return price;
    return num.toLocaleString('ar-SY');
  };

  const handlePriceChange = (key: 'minPrice' | 'maxPrice', value: string) => {
    const numericValue = value.replace(/[^\d]/g, '');
    if (numericValue) {
      handleFilterChange(key, parseFloat(numericValue));
    } else {
      handleFilterChange(key, undefined);
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-100 ${className}`}>
      {/* Filter Toggle Button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Filter className="h-5 w-5 text-blue-600" />
          </div>
          <span className="font-bold text-gray-900">فلاتر البحث المتقدم</span>
          {getActiveFiltersCount() > 0 && (
            <span className="bg-blue-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
              {getActiveFiltersCount()}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          {getActiveFiltersCount() > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              مسح الكل
            </button>
          )}
          <div className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`}>
            ⌄
          </div>
        </div>
      </button>

      {/* Filters Content */}
      {showFilters && (
        <div className="border-t border-gray-100 p-6 space-y-6">
          {/* Price Range */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 space-x-reverse">
              <DollarSign className="h-5 w-5 text-green-600" />
              <label className="font-semibold text-gray-900">نطاق السعر (ليرة سورية)</label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">السعر الأدنى</label>
                <input
                  type="text"
                  placeholder="مثال: 100,000"
                  value={filters.minPrice ? formatPrice(filters.minPrice.toString()) : ''}
                  onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">السعر الأعلى</label>
                <input
                  type="text"
                  placeholder="مثال: 1,000,000"
                  value={filters.maxPrice ? formatPrice(filters.maxPrice.toString()) : ''}
                  onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                  dir="rtl"
                />
              </div>
            </div>
          </div>

          {/* Condition */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Package className="h-5 w-5 text-orange-600" />
              <label className="font-semibold text-gray-900">حالة المنتج</label>
            </div>
            <select
              value={filters.condition || ''}
              onChange={(e) => handleFilterChange('condition', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
              dir="rtl"
            >
              <option value="">جميع الحالات</option>
              {conditions.map(condition => (
                <option key={condition.value} value={condition.value}>
                  {condition.label}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 space-x-reverse">
              <MapPin className="h-5 w-5 text-purple-600" />
              <label className="font-semibold text-gray-900">المدينة</label>
            </div>
            <select
              value={filters.location || ''}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
              dir="rtl"
            >
              <option value="">جميع المدن</option>
              {syrianCities.map(city => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Calendar className="h-5 w-5 text-blue-600" />
              <label className="font-semibold text-gray-900">تاريخ النشر</label>
            </div>
            <select
              value={filters.dateRange || ''}
              onChange={(e) => handleFilterChange('dateRange', e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
              dir="rtl"
            >
              <option value="">أي وقت</option>
              <option value="1">آخر 24 ساعة</option>
              <option value="7">آخر أسبوع</option>
              <option value="30">آخر شهر</option>
              <option value="90">آخر 3 أشهر</option>
            </select>
          </div>

          {/* Apply/Clear Buttons */}
          <div className="flex justify-end space-x-3 space-x-reverse pt-4 border-t border-gray-100">
            <button
              onClick={onClear}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              مسح الفلاتر
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              تطبيق الفلاتر
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;