import React, { useState } from 'react';
import { Car, Home, Smartphone, Sofa, Dumbbell, Shirt, TreePine, Book, Gamepad2, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { categories } from '../../data/mockData';

interface CategoryNavProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryNav: React.FC<CategoryNavProps> = ({ selectedCategory, onCategoryChange }) => {
  const [showAll, setShowAll] = useState(false);

  const categoryIcons: { [key: string]: React.ReactNode } = {
    'سيارات': <Car className="h-4 w-4 md:h-5 md:w-5" />,
    'عقارات': <Home className="h-4 w-4 md:h-5 md:w-5" />,
    'إلكترونيات': <Smartphone className="h-4 w-4 md:h-5 md:w-5" />,
    'أثاث': <Sofa className="h-4 w-4 md:h-5 md:w-5" />,
    'رياضة': <Dumbbell className="h-4 w-4 md:h-5 md:w-5" />,
    'أزياء': <Shirt className="h-4 w-4 md:h-5 md:w-5" />,
    'منزل وحديقة': <TreePine className="h-4 w-4 md:h-5 md:w-5" />,
    'كتب': <Book className="h-4 w-4 md:h-5 md:w-5" />,
    'ألعاب': <Gamepad2 className="h-4 w-4 md:h-5 md:w-5" />,
    'أخرى': <MoreHorizontal className="h-4 w-4 md:h-5 md:w-5" />,
  };

  const visibleCategories = showAll ? categories : categories.slice(0, 6);

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Categories */}
          <div className="flex items-center space-x-2 space-x-reverse overflow-x-auto rtl-scroll flex-1">
            <button
              onClick={() => onCategoryChange('all')}
              className={`whitespace-nowrap px-4 md:px-6 py-2 md:py-3 text-sm font-medium rounded-lg transition-all flex items-center space-x-2 space-x-reverse ${
                selectedCategory === 'all'
                  ? 'bg-blue-700 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50 border border-gray-200'
              }`}
            >
              <MoreHorizontal className="h-4 w-4" />
              <span>الكل</span>
            </button>
            
            {visibleCategories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`whitespace-nowrap px-4 md:px-6 py-2 md:py-3 text-sm font-medium rounded-lg transition-all flex items-center space-x-2 space-x-reverse ${
                  selectedCategory === category
                    ? 'bg-blue-700 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50 border border-gray-200'
                }`}
              >
                {categoryIcons[category]}
                <span className="hidden sm:inline">{category}</span>
              </button>
            ))}
          </div>

          {/* Show More/Less Button */}
          {categories.length > 6 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="flex items-center space-x-1 space-x-reverse text-blue-600 hover:text-blue-700 font-medium text-sm px-3 py-2 rounded-lg hover:bg-blue-50 transition-all whitespace-nowrap mr-4"
            >
              <span>{showAll ? 'أقل' : 'المزيد'}</span>
              {showAll ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          )}
        </div>

        {/* Mobile Category Grid */}
        {showAll && (
          <div className="md:hidden pb-4">
            <div className="grid grid-cols-3 gap-2">
              {categories.slice(6).map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    onCategoryChange(category);
                    setShowAll(false);
                  }}
                  className={`px-3 py-2 text-xs font-medium rounded-lg transition-all flex flex-col items-center space-y-1 ${
                    selectedCategory === category
                      ? 'bg-blue-700 text-white shadow-md'
                      : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50 border border-gray-200'
                  }`}
                >
                  {categoryIcons[category]}
                  <span className="text-center leading-tight">{category}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryNav;