import React, { useState } from 'react';
import { Star, MessageCircle, Send, ThumbsUp, Reply, MoreVertical } from 'lucide-react';
import { Comment, Ad } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface AdCommentsProps {
  ad: Ad;
  comments: Comment[];
  onAddComment: (content: string, rating?: number) => void;
  onReplyToComment: (commentId: string, content: string) => void;
}

const AdComments: React.FC<AdCommentsProps> = ({ 
  ad, 
  comments, 
  onAddComment,
  onReplyToComment 
}) => {
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    
    if (!isAuthenticated) {
      alert('يجب تسجيل الدخول أولاً لإضافة تعليق');
      return;
    }
    
    onAddComment(newComment, newRating > 0 ? newRating : undefined);
    setNewComment('');
    setNewRating(0);
  };

  const handleSubmitReply = (commentId: string) => {
    if (!replyContent.trim()) return;
    
    if (!isAuthenticated) {
      alert('يجب تسجيل الدخول أولاً للرد على التعليق');
      return;
    }
    
    onReplyToComment(commentId, replyContent);
    setReplyContent('');
    setReplyingTo(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'الآن';
    } else if (diffInHours < 24) {
      return `منذ ${Math.floor(diffInHours)} ساعة`;
    } else if (diffInHours < 48) {
      return 'أمس';
    } else {
      const days = Math.floor(diffInHours / 24);
      return `منذ ${days} يوم`;
    }
  };

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1 space-x-reverse">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && onRate && onRate(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            disabled={!interactive}
          >
            <Star
              className={`h-4 w-4 ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const displayedComments = showAllComments ? comments : comments.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Comments Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 space-x-reverse">
          <MessageCircle className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">
            التعليقات ({comments.length})
          </h3>
          {ad.averageRating && (
            <div className="flex items-center space-x-2 space-x-reverse">
              <div className="flex items-center space-x-1 space-x-reverse">
                {renderStars(Math.round(ad.averageRating))}
              </div>
              <span className="text-sm text-gray-600">
                ({ad.averageRating.toFixed(1)})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Add Comment Form */}
      {isAuthenticated ? (
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <div className="flex items-center space-x-3 space-x-reverse">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user?.name?.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-500">أضف تعليقك على هذا المنتج</p>
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              تقييم المنتج (اختياري)
            </label>
            {renderStars(newRating, true, setNewRating)}
          </div>

          {/* Comment Input */}
          <div className="space-y-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="شاركنا رأيك في هذا المنتج..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right resize-none"
              dir="rtl"
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {newComment.length}/500 حرف
              </span>
              <button
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 space-x-reverse"
              >
                <Send className="h-4 w-4" />
                <span>نشر التعليق</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-3">يجب تسجيل الدخول لإضافة تعليق</p>
          <p className="text-sm text-gray-500 mb-4">انضم إلى مجتمعنا وشارك رأيك في المنتجات</p>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('showAuth'))}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            تسجيل الدخول
          </button>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {displayedComments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">لا توجد تعليقات بعد</p>
            <p className="text-gray-400 text-sm">كن أول من يعلق على هذا المنتج</p>
          </div>
        ) : (
          displayedComments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              {/* Comment Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3 space-x-reverse">
                  {comment.user.avatar ? (
                    <img
                      src={comment.user.avatar}
                      alt={comment.user.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {comment.user.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{comment.user.name}</p>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className="text-sm text-gray-500">
                        {formatDate(comment.createdAt)}
                      </span>
                      {comment.rating && (
                        <div className="flex items-center space-x-1 space-x-reverse">
                          {renderStars(comment.rating)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>

              {/* Comment Content */}
              <p className="text-gray-700 mb-4 leading-relaxed">{comment.content}</p>

              {/* Comment Actions */}
              <div className="flex items-center space-x-4 space-x-reverse">
                <button className="flex items-center space-x-1 space-x-reverse text-gray-500 hover:text-blue-600 transition-colors">
                  <ThumbsUp className="h-4 w-4" />
                  <span className="text-sm">مفيد</span>
                </button>
                {isAuthenticated && (
                  <button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="flex items-center space-x-1 space-x-reverse text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <Reply className="h-4 w-4" />
                    <span className="text-sm">رد</span>
                  </button>
                )}
                {!isAuthenticated && (
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('showAuth'))}
                    className="flex items-center space-x-1 space-x-reverse text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <Reply className="h-4 w-4" />
                    <span className="text-sm">رد (تسجيل الدخول مطلوب)</span>
                  </button>
                )}
              </div>

              {/* Reply Form */}
              {replyingTo === comment.id && (
                <div className="mt-4 pr-12 space-y-3">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="اكتب ردك..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right text-sm"
                    dir="rtl"
                  />
                  <div className="flex justify-end space-x-2 space-x-reverse">
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={() => handleSubmitReply(comment.id)}
                      disabled={!replyContent.trim()}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      رد
                    </button>
                  </div>
                </div>
              )}

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 pr-12 space-y-3">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 space-x-reverse mb-2">
                        {reply.user.avatar ? (
                          <img
                            src={reply.user.avatar}
                            alt={reply.user.name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                            <span className="text-white font-bold text-xs">
                              {reply.user.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{reply.user.name}</p>
                          <span className="text-xs text-gray-500">
                            {formatDate(reply.createdAt)}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}

        {/* Show More Comments */}
        {comments.length > 3 && !showAllComments && (
          <button
            onClick={() => setShowAllComments(true)}
            className="w-full py-3 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            عرض جميع التعليقات ({comments.length - 3} أخرى)
          </button>
        )}
      </div>
    </div>
  );
};

export default AdComments;