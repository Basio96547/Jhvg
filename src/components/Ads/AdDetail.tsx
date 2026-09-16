import React, { useState } from 'react';
import { X, MapPin, Clock, Star, MessageCircle, Heart, Phone, Mail, Eye, Share2 } from 'lucide-react';
import { Ad, Comment } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import AdComments from './AdComments';

interface AdDetailProps {
  ad: Ad;
  onClose: () => void;
  onStartConversation: (ad: Ad) => void;
  onAddComment: (adId: string, content: string, rating?: number) => void;
  onReplyToComment: (adId: string, commentId: string, content: string) => void;
  onToggleFavorite: (adId: string) => void;
  isFavorite: boolean;
}

const AdDetail: React.FC<AdDetailProps> = ({ 
  ad, 
  onClose, 
  onStartConversation,
  onAddComment,
  onReplyToComment,
  onToggleFavorite,
  isFavorite 
}) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [showContact, setShowContact] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [comments, setComments] = useState<Comment[]>(ad.comments || []);
  const [activeTab, setActiveTab] = useState<'details' | 'comments'>('details');
  const { user, isAuthenticated } = useAuth();
  const { t, isRTL } = useLanguage();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)} مليون ل.س`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(0)} ألف ل.س`;
    }
    return `${price.toLocaleString('ar-SY')} ل.س`;
  };

  const handleMakeOffer = () => {
    if (!offerAmount || !isAuthenticated) return;
    onStartConversation(ad);
  };

  const handleAddComment = (content: string, rating?: number) => {
    if (!user) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      adId: ad.id,
      userId: user.id,
      content,
      rating,
      createdAt: new Date().toISOString(),
      user,
    };

    setComments(prev => [newComment, ...prev]);
  };

  const handleReplyToComment = (commentId: string, content: string) => {
    if (!user) return;

    const reply: Comment = {
      id: Date.now().toString(),
      adId: ad.id,
      userId: user.id,
      content,
      createdAt: new Date().toISOString(),
      user,
    };

    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply]
        };
      }
      return comment;
    }));
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new':
        return 'bg-green-100 text-green-800';
      case 'like-new':
        return 'bg-blue-100 text-blue-800';
      case 'good':
        return 'bg-yellow-100 text-yellow-800';
      case 'fair':
        return 'bg-orange-100 text-orange-800';
      case 'poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionLabel = (condition: string) => {
    switch (condition) {
      case 'new': return 'جديد';
      case 'like-new': return 'كالجديد';
      case 'good': return 'جيد';
      case 'fair': return 'مقبول';
      case 'poor': return 'ضعيف';
      default: return condition;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-blue-100">
          <h2 className="text-2xl font-bold text-gray-900">تفاصيل الإعلان</h2>
          <div className="flex items-center space-x-3 space-x-reverse">
            <button className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
              <Heart 
                className={`h-6 w-6 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
                onClick={() => onToggleFavorite(ad.id)}
              />
            </button>
            <button className="p-2 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all">
              <Share2 className="h-6 w-6" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex space-x-8 space-x-reverse px-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'details'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              تفاصيل المنتج
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 space-x-reverse ${
                activeTab === 'comments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <MessageCircle className="h-4 w-4" />
              <span>التعليقات ({comments.length})</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'details' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Images */}
              <div className="space-y-4">
                <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={ad.images[currentImage]}
                    alt={ad.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {ad.images.length > 1 && (
                  <div className="flex space-x-2 space-x-reverse overflow-x-auto pb-2">
                    {ad.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImage(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImage ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${ad.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="space-y-6">
                {/* Title and Price */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">{ad.title}</h1>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl font-bold text-blue-600">
                      {formatPrice(ad.price)}
                    </div>
                    {ad.featured && (
                      <span className="featured-badge">
                        ⭐ مميز
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-500">
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <MapPin className="h-4 w-4" />
                      <span>{ad.location}</span>
                    </div>
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(ad.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <Eye className="h-4 w-4" />
                      <span>{ad.views} مشاهدة</span>
                    </div>
                  </div>
                </div>

                {/* Condition and Category */}
                <div className="flex items-center space-x-4 space-x-reverse">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${getConditionColor(ad.condition)}`}
                  >
                    {getConditionLabel(ad.condition)}
                  </span>
                  <span className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    {ad.category}
                  </span>
                  {ad.averageRating && (
                    <div className="flex items-center space-x-1 space-x-reverse">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{ad.averageRating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-3">وصف المنتج</h3>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{ad.description}</p>
                </div>

                {/* Seller Info */}
                <div className="border-t pt-6">
                  <h3 className="font-bold text-gray-900 mb-4">معلومات البائع</h3>
                  <div className="flex items-center space-x-4 space-x-reverse">
                    {ad.user?.avatar ? (
                      <img
                        src={ad.user.avatar}
                        alt={ad.user.name}
                        className="h-16 w-16 rounded-full object-cover border-4 border-blue-100 shadow-md"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md">
                        <span className="text-white text-xl font-bold">
                          {ad.user?.name?.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-lg">{ad.user?.name}</p>
                      <div className="flex items-center space-x-1 space-x-reverse">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">
                          {ad.user?.rating} ({ad.user?.reviewCount} تقييم)
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        عضو منذ {formatDate(ad.user?.joinDate || '')}
                      </p>
                    </div>
                  </div>

                  {/* Contact Actions */}
                  <div className="mt-6 space-y-3">
                    {isAuthenticated ? (
                      <>
                        <button
                          onClick={() => onStartConversation(ad)}
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-bold flex items-center justify-center space-x-2 space-x-reverse shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          <MessageCircle className="h-5 w-5" />
                          <span>بدء محادثة</span>
                        </button>

                        <div className="flex space-x-2 space-x-reverse">
                          <input
                            type="number"
                            placeholder="اقترح سعرك"
                            value={offerAmount}
                            onChange={(e) => setOfferAmount(e.target.value)}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right"
                            dir="rtl"
                          />
                          <button
                            onClick={handleMakeOffer}
                            className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-medium"
                          >
                            اقتراح سعر
                          </button>
                        </div>

                        <button
                          onClick={() => setShowContact(!showContact)}
                          className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                        >
                          عرض معلومات الاتصال
                        </button>

                        {showContact && (
                          <div className="mt-4 p-4 bg-blue-50 rounded-xl space-y-2">
                            {ad.user?.phone && (
                              <div className="flex items-center space-x-3 space-x-reverse">
                                <Phone className="h-5 w-5 text-blue-600" />
                                <span className="font-medium">{ad.user.phone}</span>
                              </div>
                            )}
                            {ad.user?.email && (
                              <div className="flex items-center space-x-3 space-x-reverse">
                                <Mail className="h-5 w-5 text-blue-600" />
                                <span className="font-medium">{ad.user.email}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-600 mb-4">سجل دخولك للتواصل مع البائع</p>
                        <button
                          onClick={onClose}
                          className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
                        >
                          تسجيل الدخول
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <AdComments
              ad={ad}
              comments={comments}
              onAddComment={handleAddComment}
              onReplyToComment={handleReplyToComment}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdDetail;