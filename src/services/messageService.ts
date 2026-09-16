import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export class MessageService {
  // الحصول على محادثات المستخدم
  static async getConversations(userId: string) {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        ads:ad_id (
          id,
          title,
          price,
          images,
          status
        ),
        buyer:buyer_id (
          id,
          name,
          avatar_url
        ),
        seller:seller_id (
          id,
          name,
          avatar_url
        )
      `)
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order('last_message_time', { ascending: false });

    if (error) throw error;

    return data?.map(conv => ({
      id: conv.id,
      adId: conv.ad_id,
      buyerId: conv.buyer_id,
      sellerId: conv.seller_id,
      lastMessage: conv.last_message,
      lastMessageTime: conv.last_message_time,
      ad: conv.ads ? {
        id: conv.ads.id,
        title: conv.ads.title,
        price: conv.ads.price,
        images: conv.ads.images,
        status: conv.ads.status,
      } : undefined,
      buyer: conv.buyer ? {
        id: conv.buyer.id,
        name: conv.buyer.name,
        avatar: conv.buyer.avatar_url,
      } : undefined,
      seller: conv.seller ? {
        id: conv.seller.id,
        name: conv.seller.name,
        avatar: conv.seller.avatar_url,
      } : undefined,
      messages: [],
    })) || [];
  }

  // الحصول على رسائل محادثة
  static async getMessages(conversationId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:sender_id (
          id,
          name,
          avatar_url
        )
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return data?.map(msg => ({
      id: msg.id,
      conversationId: msg.conversation_id,
      senderId: msg.sender_id,
      content: msg.content,
      offer: msg.offer,
      images: msg.images,
      isRead: msg.is_read,
      timestamp: msg.created_at,
      sender: msg.sender ? {
        id: msg.sender.id,
        name: msg.sender.name,
        avatar: msg.sender.avatar_url,
      } : undefined,
    })) || [];
  }

  // إنشاء محادثة جديدة
  static async createConversation(adId: string, buyerId: string, sellerId: string) {
    // التحقق من وجود محادثة مسبقة
    const { data: existing } = await supabase
      .from('conversations')
      .select('id')
      .eq('ad_id', adId)
      .eq('buyer_id', buyerId)
      .eq('seller_id', sellerId)
      .single();

    if (existing) {
      return existing.id;
    }

    // إنشاء محادثة جديدة
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        id: uuidv4(),
        ad_id: adId,
        buyer_id: buyerId,
        seller_id: sellerId,
        last_message: 'بدء المحادثة',
        last_message_time: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  }

  // إرسال رسالة
  static async sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
    offer?: number,
    images?: string[]
  ) {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        id: uuidv4(),
        conversation_id: conversationId,
        sender_id: senderId,
        content,
        offer,
        images,
      })
      .select()
      .single();

    if (error) throw error;

    // تحديث آخر رسالة في المحادثة
    await supabase
      .from('conversations')
      .update({
        last_message: content,
        last_message_time: new Date().toISOString(),
      })
      .eq('id', conversationId);

    return data;
  }

  // تمييز الرسائل كمقروءة
  static async markAsRead(conversationId: string, userId: string) {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('conversation_id', conversationId)
      .neq('sender_id', userId);

    if (error) throw error;
  }
}