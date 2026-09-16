import React, { useState } from 'react';
import { X, Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { Ad } from '../../types';
import AdCard from '../Ads/AdCard';

interface MyAdsListProps {
  onClose: () => void;
  userAds: Ad[];
  onCreateAd: () => void;
  onEditAd: (ad: Ad) => void;
  onDeleteAd: (adId: string) => void;
  onAdClick: (ad: Ad) => void;
}

const MyAdsList: React.FC<MyAdsListProps> = ({ 
  onClose, 
  userAds, 
  onCreateAd,
  onEditAd,
  onDeleteAd,
  onAdClick 
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'sold' | 'pending'>('active');

  const filteredAds = userAds.filter(ad => ad.status === activeTab);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'sold':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">My Ads</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={onCreateAd}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>New Ad</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex space-x-8 px-6">
            {[
              { key: 'active', label: 'Active', count: userAds.filter(ad => ad.status === 'active').length },
              { key: 'sold', label: 'Sold', count: userAds.filter(ad => ad.status === 'sold').length },
              { key: 'pending', label: 'Pending', count: userAds.filter(ad => ad.status === 'pending').length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {filteredAds.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Eye className="h-16 w-16 mb-4 text-gray-300" />
              <h3 className="text-xl font-medium mb-2">No {activeTab} ads</h3>
              <p className="text-gray-400 mb-4">
                {activeTab === 'active' 
                  ? "You haven't posted any ads yet" 
                  : `No ${activeTab} ads found`}
              </p>
              {activeTab === 'active' && (
                <button
                  onClick={onCreateAd}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Your First Ad
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAds.map((ad) => (
                <div key={ad.id} className="relative group">
                  <AdCard ad={ad} onAdClick={onAdClick} />
                  
                  {/* Status Badge */}
                  <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium ${getStatusColor(ad.status)}`}>
                    {ad.status.charAt(0).toUpperCase() + ad.status.slice(1)}
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditAd(ad);
                      }}
                      className="p-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-colors"
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Are you sure you want to delete this ad?')) {
                          onDeleteAd(ad.id);
                        }
                      }}
                      className="p-2 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Views Counter */}
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                    <Eye className="h-3 w-3 inline mr-1" />
                    {ad.views}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAdsList;