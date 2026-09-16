import React, { useState } from 'react';
import { X, MessageCircle, Search, ChevronRight } from 'lucide-react';
import { Conversation } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface MessageListProps {
  onClose: () => void;
  conversations: Conversation[];
  onSelectConversation: (conversation: Conversation) => void;
}

const MessageList: React.FC<MessageListProps> = ({ 
  onClose, 
  conversations, 
  onSelectConversation 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  const filteredConversations = conversations.filter(conversation => {
    const otherUser = conversation.buyerId === user?.id ? conversation.seller : conversation.buyer;
    const adTitle = conversation.ad?.title || '';
    return (
      otherUser?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      adTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Messages</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <MessageCircle className="h-12 w-12 mb-4" />
              <p className="text-lg">No conversations yet</p>
              <p className="text-sm">Start browsing ads to begin messaging sellers</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredConversations.map((conversation) => {
                const otherUser = conversation.buyerId === user?.id 
                  ? conversation.seller 
                  : conversation.buyer;
                
                return (
                  <button
                    key={conversation.id}
                    onClick={() => onSelectConversation(conversation)}
                    className="w-full p-4 hover:bg-gray-50 transition-colors text-left flex items-center space-x-3"
                  >
                    {/* Avatar */}
                    {otherUser?.avatar ? (
                      <img
                        src={otherUser.avatar}
                        alt={otherUser.name}
                        className="h-12 w-12 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-500 font-medium">
                          {otherUser?.name?.charAt(0)}
                        </span>
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-gray-900 truncate">
                          {otherUser?.name}
                        </p>
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.lastMessageTime)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate mb-1">
                        {conversation.ad?.title}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.lastMessage}
                      </p>
                    </div>

                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageList;