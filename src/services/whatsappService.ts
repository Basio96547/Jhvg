// خدمة إرسال رسائل الواتساب
export class WhatsAppService {
  private static instance: WhatsAppService;
  
  private constructor() {}
  
  public static getInstance(): WhatsAppService {
    if (!WhatsAppService.instance) {
      WhatsAppService.instance = new WhatsAppService();
    }
    return WhatsAppService.instance;
  }

  // الخيار 1: استخدام WhatsApp Business API (الأفضل للإنتاج)
  async sendCodeViaWhatsAppAPI(phone: string, code: string): Promise<boolean> {
    try {
      // تحتاج إلى الحصول على WhatsApp Business API Token
      const WHATSAPP_TOKEN = process.env.WHATSAPP_API_TOKEN;
      const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
      
      if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
        console.warn('WhatsApp API credentials not configured');
        return false;
      }

      const response = await fetch(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: `963${phone.substring(1)}`, // تحويل من 09xxxxxxxx إلى 963xxxxxxxx
          type: 'template',
          template: {
            name: 'verification_code', // اسم القالب المعتمد
            language: {
              code: 'ar'
            },
            components: [
              {
                type: 'body',
                parameters: [
                  {
                    type: 'text',
                    text: code
                  }
                ]
              }
            ]
          }
        })
      });

      return response.ok;
    } catch (error) {
      console.error('WhatsApp API Error:', error);
      return false;
    }
  }

  // الخيار 2: استخدام Twilio WhatsApp API
  async sendCodeViaTwilio(phone: string, code: string): Promise<boolean> {
    try {
      const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
      const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
      const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER;
      
      if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_NUMBER) {
        console.warn('Twilio credentials not configured');
        return false;
      }

      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`,
          To: `whatsapp:+963${phone.substring(1)}`,
          Body: `رمز التحقق الخاص بك في شاري مستعمل: ${code}\n\nلا تشارك هذا الرمز مع أي شخص آخر.`
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Twilio Error:', error);
      return false;
    }
  }

  // الخيار 3: استخدام خدمة محلية سورية (مثل SyriaTel API)
  async sendCodeViaSyrianProvider(phone: string, code: string): Promise<boolean> {
    try {
      // هذا مثال - تحتاج إلى استبداله بـ API الخدمة المحلية
      const SYRIAN_API_KEY = process.env.SYRIAN_SMS_API_KEY;
      const SYRIAN_API_URL = process.env.SYRIAN_SMS_API_URL;
      
      if (!SYRIAN_API_KEY || !SYRIAN_API_URL) {
        console.warn('Syrian SMS API credentials not configured');
        return false;
      }

      const message = `رمز التحقق: ${code}\nشاري مستعمل\nلا تشارك هذا الرمز`;
      
      const response = await fetch(SYRIAN_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SYRIAN_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phone,
          message: message,
          type: 'whatsapp' // أو 'sms' حسب الخدمة
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Syrian Provider Error:', error);
      return false;
    }
  }

  // الخيار 4: استخدام خدمة عامة مثل MessageBird
  async sendCodeViaMessageBird(phone: string, code: string): Promise<boolean> {
    try {
      const MESSAGEBIRD_API_KEY = process.env.MESSAGEBIRD_API_KEY;
      
      if (!MESSAGEBIRD_API_KEY) {
        console.warn('MessageBird API key not configured');
        return false;
      }

      const response = await fetch('https://conversations.messagebird.com/v1/send', {
        method: 'POST',
        headers: {
          'Authorization': `AccessKey ${MESSAGEBIRD_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: `+963${phone.substring(1)}`,
          type: 'text',
          content: {
            text: `رمز التحقق الخاص بك: ${code}\n\nشاري مستعمل`
          },
          channelId: 'whatsapp' // معرف قناة الواتساب
        })
      });

      return response.ok;
    } catch (error) {
      console.error('MessageBird Error:', error);
      return false;
    }
  }

  // دالة موحدة لإرسال الرمز مع تجربة عدة خدمات
  async sendVerificationCode(phone: string, code: string): Promise<{success: boolean, method?: string, error?: string}> {
    // ترتيب الأولوية للخدمات
    const methods = [
      { name: 'WhatsApp Business API', fn: () => this.sendCodeViaWhatsAppAPI(phone, code) },
      { name: 'Twilio', fn: () => this.sendCodeViaTwilio(phone, code) },
      { name: 'Syrian Provider', fn: () => this.sendCodeViaSyrianProvider(phone, code) },
      { name: 'MessageBird', fn: () => this.sendCodeViaMessageBird(phone, code) }
    ];

    for (const method of methods) {
      try {
        const success = await method.fn();
        if (success) {
          return { success: true, method: method.name };
        }
      } catch (error) {
        console.warn(`${method.name} failed:`, error);
        continue;
      }
    }

    return { 
      success: false, 
      error: 'فشل في إرسال رمز التحقق عبر جميع الخدمات المتاحة' 
    };
  }

  // توليد رمز تحقق عشوائي
  generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // التحقق من صحة رقم الجوال السوري
  validateSyrianPhone(phone: string): boolean {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length === 10 && cleanPhone.startsWith('09');
  }
}