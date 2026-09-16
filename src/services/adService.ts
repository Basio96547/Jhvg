import { supabase } from '../lib/supabase';
import { Ad } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class AdService {
  // الحصول على جميع الإعلانات
  static async getAds(filters?: {
    category?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    condition?: string;
    search?: string;
  }) {
    let query = supabase
      .from('ads')
      .select(`
        *,
        users:user_id (
          id,
          name,
          avatar_url,
          rating,
          review_count
        )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    // تطبيق الفلاتر
    if (filters?.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }

    if (filters?.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    if (filters?.minPrice) {
      query = query.gte('price', filters.minPrice);
    }

    if (filters?.maxPrice) {
      query = query.lte('price', filters.maxPrice);
    }

    if (filters?.condition) {
      query = query.eq('condition', filters.condition);
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data?.map(ad => ({
      id: ad.id,
      userId: ad.user_id,
      title: ad.title,
      description: ad.description,
      price: ad.price,
      images: ad.images,
      category: ad.category,
      condition: ad.condition,
      location: ad.location,
      featured: ad.featured,
      status: ad.status,
      views: ad.views,
      createdAt: ad.created_at,
      updatedAt: ad.updated_at,
      tags: ad.tags,
      specifications: ad.specifications,
      negotiable: ad.negotiable,
      deliveryAvailable: ad.delivery_available,
      user: ad.users ? {
        id: ad.users.id,
        name: ad.users.name,
        avatar: ad.users.avatar_url,
        rating: ad.users.rating,
        reviewCount: ad.users.review_count,
        email: '',
        joinDate: '',
      } : undefined,
      comments: [],
      commentsCount: 0,
    })) || [];
  }

  // الحصول على إعلان واحد
  static async getAd(id: string) {
    const { data, error } = await supabase
      .from('ads')
      .select(`
        *,
        users:user_id (
          id,
          name,
          avatar_url,
          rating,
          review_count,
          phone,
          email
        ),
        comments (
          id,
          content,
          rating,
          created_at,
          users:user_id (
            id,
            name,
            avatar_url
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    // زيادة عدد المشاهدات
    await supabase
      .from('ads')
      .update({ views: (data.views || 0) + 1 })
      .eq('id', id);

    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      description: data.description,
      price: data.price,
      images: data.images,
      category: data.category,
      condition: data.condition,
      location: data.location,
      featured: data.featured,
      status: data.status,
      views: data.views + 1,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      user: data.users ? {
        id: data.users.id,
        name: data.users.name,
        avatar: data.users.avatar_url,
        rating: data.users.rating,
        reviewCount: data.users.review_count,
        phone: data.users.phone,
        email: data.users.email,
        joinDate: '',
      } : undefined,
      comments: data.comments?.map(comment => ({
        id: comment.id,
        adId: id,
        userId: comment.users.id,
        content: comment.content,
        rating: comment.rating,
        createdAt: comment.created_at,
        user: {
          id: comment.users.id,
          name: comment.users.name,
          avatar: comment.users.avatar_url,
          email: '',
          rating: 0,
          reviewCount: 0,
          joinDate: '',
        },
      })) || [],
      commentsCount: data.comments?.length || 0,
    };
  }

  // إنشاء إعلان جديد
  static async createAd(adData: {
    title: string;
    description: string;
    price: number;
    images: string[];
    category: string;
    condition: string;
    location: string;
    tags?: string[];
    specifications?: Record<string, string>;
    negotiable?: boolean;
    deliveryAvailable?: boolean;
  }, userId: string) {
    const { data, error } = await supabase
      .from('ads')
      .insert({
        id: uuidv4(),
        user_id: userId,
        ...adData,
        delivery_available: adData.deliveryAvailable,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // تحديث إعلان
  static async updateAd(id: string, updates: Partial<Ad>, userId: string) {
    const { data, error } = await supabase
      .from('ads')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // حذف إعلان
  static async deleteAd(id: string, userId: string) {
    const { error } = await supabase
      .from('ads')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
  }

  // الحصول على إعلانات المستخدم
  static async getUserAds(userId: string) {
    const { data, error } = await supabase
      .from('ads')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // رفع الصور
  static async uploadImages(files: File[]): Promise<string[]> {
    const uploadPromises = files.map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `ads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    });

    return Promise.all(uploadPromises);
  }
}