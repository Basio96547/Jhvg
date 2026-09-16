import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Image, Paperclip, Smile, MoreVertical, Search, Phone, Video, Info, ArrowLeft } from 'lucide-react';
import { Conversation, Message } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface MessagesPageProps {
  onClose: () => void;
  conversations: Conversation[];
  onSendMessage: (conversationId: string, content: string, offer?: number, images?: string[]) => void;
  onSelectConversation: (conversation: Conversation) => void;
}

interface ExtendedMessage extends Message {
  images?: string[];
  isRead?: boolean;
  readAt?: string;
  messageType?: 'text' | 'image' | 'offer' | 'system';
}

const MessagesPage: React.FC<MessagesPageProps> = ({
  onClose,
  conversations,
  onSendMessage,
  onSelectConversation,
}) => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set(['2', '3'])); // Mock online users
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { t, isRTL } = useLanguage();

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversation?.messages]);

  // Mock typing indicator
  useEffect(() => {
    if (selectedConversation && messageText) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [messageText, selectedConversation]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('ar-SY', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('ar-SY', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('ar-SY', {
        month: 'short',
        day: 'numeric',
      });
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            newImages.push(event.target.result as string);
            if (newImages.length === files.length) {
              setSelectedImages(prev => [...prev, ...newImages]);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleSendMessage = () => {
    if (!selectedConversation || (!messageText.trim() && selectedImages.length === 0)) return;

    onSendMessage(selectedConversation.id, messageText, undefined, selectedImages.length > 0 ? selectedImages : undefined);
    setMessageText('');
    setSelectedImages([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversations.filter(conversation => {
    const otherUser = conversation.buyerId === user?.id ? conversation.seller : conversation.buyer;
    const adTitle = conversation.ad?.title || '';
    return (
      otherUser?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      adTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getOtherUser = (conversation: Conversation) => {
    return conversation.buyerId === user?.id ? conversation.seller : conversation.buyer;
  };

  const isUserOnline = (userId: string) => {
    return onlineUsers.has(userId);
  };

  const getUnreadCount = (conversation: Conversation) => {
    return conversation.messages.filter(msg => 
      msg.senderId !== user?.id && !(msg as ExtendedMessage).isRead
    ).length;
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex">
      {/* Conversations Sidebar */}
      <div className={`w-full md:w-96 border-r border-gray-200 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">الرسائل</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 h-4 w-4" />
            <input
              type="text"
              placeholder="البحث في المحادثات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:bg-white/30 focus:outline-none"
              dir="rtl"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-lg font-medium mb-2">لا توجد محادثات</h3>
              <p className="text-sm text-center mb-4">ابدأ بتصفح الإعلانات لبدء محادثة مع البائعين</p>
              <button
                onClick={onClose}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                تصفح الإعلانات
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredConversations.map((conversation) => {
                const otherUser = getOtherUser(conversation);
                const unreadCount = getUnreadCount(conversation);
                const isOnline = isUserOnline(otherUser?.id || '');
                
                return (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`w-full p-4 hover:bg-gray-50 transition-colors text-right flex items-center space-x-3 space-x-reverse ${
                      selectedConversation?.id === conversation.id ? 'bg-blue-50 border-r-4 border-blue-600' : ''
                    }`}
                  >
                    {/* Avatar with online indicator */}
                    <div className="relative flex-shrink-0">
                      {otherUser?.avatar ? (
                        <img
                          src={otherUser.avatar}
                          alt={otherUser.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                          <span className="text-white font-bold">
                            {otherUser?.name?.charAt(0)}
                          </span>
                        </div>
                      )}
                      {isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-gray-900 truncate">
                          {otherUser?.name}
                        </p>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <span className="text-xs text-gray-500">
                            {formatTime(conversation.lastMessageTime)}
                          </span>
                          {unreadCount > 0 && (
                            <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                              {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Ad info */}
                      <p className="text-sm text-blue-600 truncate mb-1 font-medium">
                        {conversation.ad?.title}
                      </p>
                      
                      {/* Last message */}
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500 truncate flex-1">
                          {conversation.lastMessage}
                        </p>
                        {isOnline && (
                          <span className="text-xs text-green-600 font-medium">متصل</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 space-x-reverse">
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                
                <div className="relative">
                  {getOtherUser(selectedConversation)?.avatar ? (
                    <img
                      src={getOtherUser(selectedConversation)?.avatar}
                      alt={getOtherUser(selectedConversation)?.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {getOtherUser(selectedConversation)?.name?.charAt(0)}
                      </span>
                    </div>
                  )}
                  {isUserOnline(getOtherUser(selectedConversation)?.id || '') && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                
                <div>
                  <p className="font-semibold text-gray-900">
                    {getOtherUser(selectedConversation)?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {isUserOnline(getOtherUser(selectedConversation)?.id || '') 
                      ? 'متصل الآن' 
                      : 'آخر ظهور منذ ساعة'
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                  <Phone className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full transition-all">
                  <Video className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all">
                  <Info className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Ad Info Bar */}
            {selectedConversation.ad && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg flex items-center space-x-3 space-x-reverse">
                <img
                  src={selectedConversation.ad.images[0]}
                  alt={selectedConversation.ad.title}
                  className="h-12 w-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {selectedConversation.ad.title}
                  </p>
                  <p className="text-lg font-bold text-blue-600">
                    {formatPrice(selectedConversation.ad.price)}
                  </p>
                </div>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  عرض الإعلان
                </button>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {selectedConversation.messages.map((msg, index) => {
              const isFromMe = msg.senderId === user?.id;
              const extendedMsg = msg as ExtendedMessage;
              const showAvatar = index === 0 || selectedConversation.messages[index - 1].senderId !== msg.senderId;
              
              return (
                <div
                  key={msg.id}
                  className={`flex ${isFromMe ? 'justify-end' : 'justify-start'} ${showAvatar ? 'mt-4' : 'mt-1'}`}
                >
                  {!isFromMe && showAvatar && (
                    <img
                      src={getOtherUser(selectedConversation)?.avatar || ''}
                      alt={getOtherUser(selectedConversation)?.name}
                      className="h-8 w-8 rounded-full object-cover mr-2 mt-auto"
                    />
                  )}
                  
                  <div className={`max-w-xs lg:max-w-md ${!isFromMe && !showAvatar ? 'mr-10' : ''}`}>
                    <div
                      className={`px-4 py-3 rounded-2xl shadow-sm ${
                        isFromMe
                          ? 'bg-blue-600 text-white rounded-br-md'
                          : 'bg-white text-gray-900 rounded-bl-md border border-gray-200'
                      }`}
                    >
                      {/* Images */}
                      {extendedMsg.images && extendedMsg.images.length > 0 && (
                        <div className="mb-2 space-y-2">
                          {extendedMsg.images.map((image, imgIndex) => (
                            <img
                              key={imgIndex}
                              src={image}
                              alt={`صورة ${imgIndex + 1}`}
                              className="w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => {
                                setPreviewImage(image);
                                setShowImagePreview(true);
                              }}
                            />
                          ))}
                        </div>
                      )}

                      {/* Offer */}
                      {msg.offer && (
                        <div className={`flex items-center space-x-2 space-x-reverse mb-2 p-2 rounded-lg ${
                          isFromMe ? 'bg-blue-500' : 'bg-green-50 border border-green-200'
                        }`}>
                          <span className={`text-lg ${isFromMe ? 'text-white' : 'text-green-600'}`}>💰</span>
                          <span className={`font-bold ${isFromMe ? 'text-white' : 'text-green-700'}`}>
                            عرض سعر: {formatPrice(msg.offer)}
                          </span>
                        </div>
                      )}

                      {/* Text content */}
                      {msg.content && (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {msg.content}
                        </p>
                      )}
                    </div>
                    
                    {/* Message info */}
                    <div className={`flex items-center space-x-2 space-x-reverse mt-1 ${
                      isFromMe ? 'justify-end' : 'justify-start'
                    }`}>
                      <span className="text-xs text-gray-500">
                        {formatTime(msg.timestamp)}
                      </span>
                      {isFromMe && (
                        <span className="text-xs text-gray-500">
                          {extendedMsg.isRead ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Image Preview */}
          {selectedImages.length > 0 && (
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex items-center space-x-2 space-x-reverse mb-2">
                <span className="text-sm font-medium text-gray-700">الصور المحددة:</span>
                <button
                  onClick={() => setSelectedImages([])}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  مسح الكل
                </button>
              </div>
              <div className="flex space-x-2 space-x-reverse overflow-x-auto">
                {selectedImages.map((image, index) => (
                  <div key={index} className="relative flex-shrink-0">
                    <img
                      src={image}
                      alt={`معاينة ${index + 1}`}
                      className="h-16 w-16 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== index))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Message Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-end space-x-2 space-x-reverse">
              <div className="flex-1">
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="اكتب رسالتك..."
                  rows={1}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-right"
                  dir="rtl"
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
              </div>
              
              <div className="flex space-x-1 space-x-reverse">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                  type="button"
                >
                  <Image className="h-5 w-5" />
                </button>
                
                <button 
                  type="button"
                  className="p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all"
                >
                  <Paperclip className="h-5 w-5" />
                </button>
                
                <button 
                  type="button"
                  className="p-3 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-full transition-all"
                >
                  <Smile className="h-5 w-5" />
                </button>
                
                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={!messageText.trim() && selectedImages.length === 0}
                  className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* No conversation selected */
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="text-8xl mb-6">💬</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">اختر محادثة</h3>
            <p className="text-gray-600">اختر محادثة من القائمة لبدء المراسلة</p>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {showImagePreview && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <button
            onClick={() => setShowImagePreview(false)}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          <img
            src={previewImage}
            alt="معاينة الصورة"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default MessagesPage;