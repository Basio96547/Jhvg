import React from 'react';
import { ArrowUpDown, Calendar, DollarSign, Eye, Star, Clock, Filter } from 'lucide-react';
import { SortOption } from '../../types';

interface SortFilterProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalAds: number;
}

const SortFilter: React.FC<SortFilterProps> = ({ sortBy, onSortChange, totalAds }) => {
  const sortOptions = [
    { value: 'newest' as SortOption, label: 'الأحدث أولاً', icon: Calendar },
    { value: 'oldest' as SortOption, label: 'الأقدم أولاً', icon: Clock },
    { value: 'price-low' as SortOption, label: 'السعر: من الأقل للأعلى', icon: DollarSign },
    { value: 'price-high' as SortOption, label: 'السعر: من الأعلى للأقل', icon: DollarSign },
    { value: 'most-viewed' as SortOption, label: 'الأكثر مشاهدة', icon: Eye },
    { value: 'highest-rated' as SortOption, label: 'الأعلى تقييماً', icon: Star },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8 bg-gradient-to-r from-white to-blue-50">
      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 space-x-reverse">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Filter className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-gray-800 font-bold text-lg">
              {totalAds.toLocaleString('ar-SY')} إعلان متاح
            </span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              محدث الآن
            </span>
          </div>

          {/* Desktop Sort Dropdown */}
          <div className="hidden md:flex items-center space-x-3 space-x-reverse">
            <span className="text-sm text-gray-700 font-medium whitespace-nowrap">ترتيب حسب:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right min-w-[200px] shadow-sm hover:border-blue-300 transition-colors"
              dir="rtl"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile Sort Dropdown */}
        <div className="md:hidden">
          <label className="block text-sm font-bold text-gray-800 mb-3">ترتيب حسب:</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="w-full bg-white border-2 border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right shadow-sm"
            dir="rtl"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Quick Sort Buttons - Desktop Only */}
        <div className="hidden md:flex flex-wrap gap-3 pt-6 border-t border-gray-200">
          {sortOptions.slice(0, 4).map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => onSortChange(option.value)}
                className={`flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  sortBy === option.value
                    ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden lg:inline">{option.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Quick Sort Buttons */}
        <div className="md:hidden grid grid-cols-2 gap-3 pt-6 border-t border-gray-200">
          {sortOptions.slice(0, 4).map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => onSortChange(option.value)}
                className={`flex items-center justify-center space-x-2 space-x-reverse px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  sortBy === option.value
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{option.label.split(':')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SortFilter;