import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar_url?: string;
          phone?: string;
          location?: string;
          bio?: string;
          rating?: number;
          review_count?: number;
          is_verified?: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          avatar_url?: string;
          phone?: string;
          location?: string;
          bio?: string;
          rating?: number;
          review_count?: number;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          avatar_url?: string;
          phone?: string;
          location?: string;
          bio?: string;
          rating?: number;
          review_count?: number;
          is_verified?: boolean;
          updated_at?: string;
        };
      };
      ads: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          price: number;
          images: string[];
          category: string;
          condition: string;
          location: string;
          featured: boolean;
          status: string;
          views: number;
          tags: string[];
          specifications: Record<string, any>;
          negotiable: boolean;
          delivery_available: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          price: number;
          images?: string[];
          category: string;
          condition: string;
          location: string;
          featured?: boolean;
          status?: string;
          views?: number;
          tags?: string[];
          specifications?: Record<string, any>;
          negotiable?: boolean;
          delivery_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          price?: number;
          images?: string[];
          category?: string;
          condition?: string;
          location?: string;
          featured?: boolean;
          status?: string;
          views?: number;
          tags?: string[];
          specifications?: Record<string, any>;
          negotiable?: boolean;
          delivery_available?: boolean;
          updated_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          ad_id: string;
          user_id: string;
          content: string;
          rating?: number;
          parent_id?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          ad_id: string;
          user_id: string;
          content: string;
          rating?: number;
          parent_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          ad_id?: string;
          user_id?: string;
          content?: string;
          rating?: number;
          parent_id?: string;
          updated_at?: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          ad_id: string;
          buyer_id: string;
          seller_id: string;
          last_message?: string;
          last_message_time: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          ad_id: string;
          buyer_id: string;
          seller_id: string;
          last_message?: string;
          last_message_time?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          ad_id?: string;
          buyer_id?: string;
          seller_id?: string;
          last_message?: string;
          last_message_time?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          offer?: number;
          images: string[];
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          offer?: number;
          images?: string[];
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          sender_id?: string;
          content?: string;
          offer?: number;
          images?: string[];
          is_read?: boolean;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          ad_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          ad_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          ad_id?: string;
        };
      };
      user_ratings: {
        Row: {
          id: string;
          rated_user_id: string;
          rater_user_id: string;
          ad_id: string;
          rating: number;
          comment?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          rated_user_id: string;
          rater_user_id: string;
          ad_id: string;
          rating: number;
          comment?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          rated_user_id?: string;
          rater_user_id?: string;
          ad_id?: string;
          rating?: number;
          comment?: string;
        };
      };
    };
  };
}