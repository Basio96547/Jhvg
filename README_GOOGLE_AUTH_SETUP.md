# دليل إعداد تسجيل الدخول عبر Google

## خطوات الإعداد:

### 1. إنشاء مشروع في Google Cloud Console
1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. أنشئ مشروع جديد أو اختر مشروع موجود
3. فعّل Google Identity API

### 2. إعداد OAuth 2.0
1. اذهب إلى "APIs & Services" > "Credentials"
2. انقر على "Create Credentials" > "OAuth 2.0 Client IDs"
3. اختر "Web application"
4. أضف النطاقات المسموحة:
   - `http://localhost:5173` (للتطوير)
   - `https://yourdomain.com` (للإنتاج)

### 3. الحصول على Client ID
1. انسخ Client ID من صفحة Credentials
2. أضفه إلى ملف `.env`:
   ```
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```

### 4. إعداد OAuth Consent Screen
1. اذهب إلى "OAuth consent screen"
2. املأ المعلومات المطلوبة:
   - App name: شاري مستعمل
   - User support email: your-email@domain.com
   - Developer contact information

### 5. إضافة النطاقات (Scopes)
أضف النطاقات التالية:
- `email`
- `profile`
- `openid`

## الميزات المتاحة:

### ✅ المميزات:
- تسجيل دخول سريع وآمن
- لا حاجة لكلمة مرور
- معلومات المستخدم محدثة تلقائياً
- دعم الصور الشخصية
- تحقق تلقائي من البريد الإلكتروني

### 🔒 الأمان:
- مصادقة OAuth 2.0 الآمنة
- لا يتم حفظ كلمات المرور
- رموز الوصول محدودة الصلاحية
- حماية من هجمات CSRF

## الاختبار:
1. تأكد من إضافة Client ID إلى `.env`
2. أعد تشغيل الخادم
3. جرب تسجيل الدخول عبر Google

## استكشاف الأخطاء:

### خطأ "Invalid Client ID":
- تأكد من صحة Client ID في `.env`
- تأكد من إضافة النطاق الصحيح في Google Console

### خطأ "Redirect URI Mismatch":
- تأكد من إضافة النطاق في "Authorized JavaScript origins"

### لا تظهر نافذة Google:
- تأكد من عدم حظر النوافذ المنبثقة
- جرب في وضع التصفح الخفي

## الدعم:
للمساعدة في الإعداد، راجع [وثائق Google Identity](https://developers.google.com/identity/gsi/web)