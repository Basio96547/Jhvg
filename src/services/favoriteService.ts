import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export class FavoriteService {
  // الحصول على مفضلات المستخدم
  static async getFavorites(userId: string) {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        ads:ad_id (
          id,
          title,
          description,
          price,
          images,
          category,
          condition,
          location,
          status,
          created_at,
          users:user_id (
            id,
            name,
            avatar_url,
            rating,
            review_count
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(fav => ({
      id: fav.ads.id,
      userId: fav.ads.users.id,
      title: fav.ads.title,
      description: fav.ads.description,
      price: fav.ads.price,
      images: fav.ads.images,
      category: fav.ads.category,
      condition: fav.ads.condition,
      location: fav.ads.location,
      status: fav.ads.status,
      createdAt: fav.ads.created_at,
      user: {
        id: fav.ads.users.id,
        name: fav.ads.users.name,
        avatar: fav.ads.users.avatar_url,
        rating: fav.ads.users.rating,
        reviewCount: fav.ads.users.review_count,
        email: '',
        joinDate: '',
      },
      views: 0,
      featured: false,
      updatedAt: '',
      comments: [],
      commentsCount: 0,
    })) || [];
  }

  // إضافة إلى المفضلة
  static async addToFavorites(userId: string, adId: string) {
    const { error } = await supabase
      .from('favorites')
      .insert({
        id: uuidv4(),
        user_id: userId,
        ad_id: adId,
      });

    if (error) throw error;
  }

  // إزالة من المفضلة
  static async removeFromFavorites(userId: string, adId: string) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('ad_id', adId);

    if (error) throw error;
  }

  // التحقق من وجود الإعلان في المفضلة
  static async isFavorite(userId: string, adId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('ad_id', adId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  }

  // الحصول على قائمة معرفات المفضلة
  static async getFavoriteIds(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select('ad_id')
      .eq('user_id', userId);

    if (error) throw error;
    return data?.map(fav => fav.ad_id) || [];
  }
}