export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  location?: string;
  rating: number;
  reviewCount: number;
  joinDate: string;
  bio?: string;
}

export interface Comment {
  id: string;
  adId: string;
  userId: string;
  content: string;
  rating?: number;
  createdAt: string;
  user: User;
  replies?: Comment[];
}

export interface Ad {
  id: string;
  userId: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  location: string;
  createdAt: string;
  updatedAt: string;
  featured: boolean;
  status: 'active' | 'sold' | 'pending';
  views: number;
  user?: User;
  comments?: Comment[];
  commentsCount: number;
  averageRating?: number;
  tags?: string[];
  specifications?: { [key: string]: string };
  negotiable?: boolean;
  deliveryAvailable?: boolean;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: string;
  offer?: number;
  images?: string[];
  isRead?: boolean;
  readAt?: string;
  messageType?: 'text' | 'image' | 'offer' | 'system';
}

export interface Conversation {
  id: string;
  adId: string;
  buyerId: string;
  sellerId: string;
  messages: Message[];
  lastMessage: string;
  lastMessageTime: string;
  ad?: Ad;
  buyer?: User;
  seller?: User;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export type SortOption = 'newest' | 'oldest' | 'price-low' | 'price-high' | 'most-viewed' | 'highest-rated';