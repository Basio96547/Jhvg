import React, { useState, useRef, useEffect } from 'react';
import { X, Send, ArrowLeft, DollarSign } from 'lucide-react';
import { Conversation, Message } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface MessageViewProps {
  conversation: Conversation;
  onClose: () => void;
  onBack: () => void;
  onSendMessage: (conversationId: string, content: string, offer?: number) => void;
}

const MessageView: React.FC<MessageViewProps> = ({ 
  conversation, 
  onClose, 
  onBack,
  onSendMessage 
}) => {
  const [message, setMessage] = useState('');
  const [offerAmount, setOfferAmount] = useState('');
  const [showOfferInput, setShowOfferInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const otherUser = conversation.buyerId === user?.id 
    ? conversation.seller 
    : conversation.buyer;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages]);

  const handleSendMessage = () => {
    if (!message.trim() && !offerAmount) return;

    const offer = offerAmount ? parseFloat(offerAmount) : undefined;
    onSendMessage(conversation.id, message || `Offer: $${offerAmount}`, offer);
    setMessage('');
    setOfferAmount('');
    setShowOfferInput(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            {otherUser?.avatar ? (
              <img
                src={otherUser.avatar}
                alt={otherUser.name}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-sm">
                  {otherUser?.name?.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <p className="font-medium text-gray-900">{otherUser?.name}</p>
              <p className="text-xs text-gray-500">{conversation.ad?.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Ad Info */}
        {conversation.ad && (
          <div className="p-4 bg-gray-50 border-b flex items-center space-x-3">
            <img
              src={conversation.ad.images[0]}
              alt={conversation.ad.title}
              className="h-16 w-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900">{conversation.ad.title}</p>
              <p className="text-lg font-bold text-blue-600">
                {formatPrice(conversation.ad.price)}
              </p>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {conversation.messages.map((msg) => {
            const isFromMe = msg.senderId === user?.id;
            return (
              <div
                key={msg.id}
                className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isFromMe
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {msg.offer && (
                    <div className={`flex items-center space-x-1 mb-1 ${
                      isFromMe ? 'text-blue-100' : 'text-blue-600'
                    }`}>
                      <DollarSign className="h-4 w-4" />
                      <span className="font-semibold">Offer: {formatPrice(msg.offer)}</span>
                    </div>
                  )}
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${
                    isFromMe ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          {showOfferInput && (
            <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <input
                  type="number"
                  placeholder="Enter your offer"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  className="flex-1 px-3 py-1 border border-green-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  onClick={() => setShowOfferInput(false)}
                  className="text-green-600 hover:text-green-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <button
                onClick={() => setShowOfferInput(!showOfferInput)}
                className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                title="Make an offer"
              >
                <DollarSign className="h-5 w-5" />
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() && !offerAmount}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageView;