import React from 'react';
import { X, Heart } from 'lucide-react';
import { Ad } from '../../types';
import AdCard from '../Ads/AdCard';

interface FavoritesListProps {
  onClose: () => void;
  favorites: Ad[];
  onAdClick: (ad: Ad) => void;
  onRemoveFavorite: (adId: string) => void;
}

const FavoritesList: React.FC<FavoritesListProps> = ({ 
  onClose, 
  favorites, 
  onAdClick,
  onRemoveFavorite 
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-500" />
            <span>My Favorites</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Heart className="h-16 w-16 mb-4 text-gray-300" />
              <h3 className="text-xl font-medium mb-2">No favorites yet</h3>
              <p className="text-gray-400">Start browsing and save items you love!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((ad) => (
                <div key={ad.id} className="relative">
                  <AdCard ad={ad} onAdClick={onAdClick} />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFavorite(ad.id);
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesList;