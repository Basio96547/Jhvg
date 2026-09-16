// خدمة تسجيل الدخول عبر Google
export class GoogleAuthService {
  private static instance: GoogleAuthService;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): GoogleAuthService {
    if (!GoogleAuthService.instance) {
      GoogleAuthService.instance = new GoogleAuthService();
    }
    return GoogleAuthService.instance;
  }

  // تهيئة Google Auth
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    // التحقق من وجود Client ID
    if (!clientId || clientId === 'your-google-client-id-here.apps.googleusercontent.com') {
      throw new Error('Google Client ID غير مكون بشكل صحيح. يرجى إضافة VITE_GOOGLE_CLIENT_ID في ملف .env');
    }

    try {
      // تحميل Google Identity Services
      await this.loadGoogleScript();
      
      // تهيئة Google Identity Services
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: this.handleCredentialResponse.bind(this),
          auto_select: false,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: false, // تعطيل FedCM لتجنب مشاكل التوافق
        });
        
        this.isInitialized = true;
      }
    } catch (error) {
      console.error('Failed to initialize Google Auth:', error);
      throw new Error('فشل في تهيئة تسجيل الدخول عبر Google');
    }
  }

  // تحميل مكتبة Google
  private loadGoogleScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.google) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google script'));
      
      document.head.appendChild(script);
    });
  }

  // معالجة استجابة Google
  private handleCredentialResponse(response: any): void {
    try {
      // فك تشفير JWT token
      const userInfo = this.parseJWT(response.credential);
      
      // إرسال بيانات المستخدم للمكون
      const event = new CustomEvent('googleAuthSuccess', {
        detail: {
          id: userInfo.sub,
          email: userInfo.email,
          name: userInfo.name,
          avatar: userInfo.picture,
          emailVerified: userInfo.email_verified,
        }
      });
      
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error handling Google credential:', error);
      const errorEvent = new CustomEvent('googleAuthError', {
        detail: { error: 'فشل في معالجة بيانات Google' }
      });
      window.dispatchEvent(errorEvent);
    }
  }

  // فك تشفير JWT token
  private parseJWT(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      throw new Error('Invalid JWT token');
    }
  }

  // عرض نافذة تسجيل الدخول
  public async signIn(): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // عرض نافذة تسجيل الدخول
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // في حالة عدم عرض النافذة، استخدم الطريقة البديلة
          this.showOneTapFallback();
        }
      });
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw new Error('فشل في تسجيل الدخول عبر Google');
    }
  }

  // طريقة بديلة لتسجيل الدخول
  private showOneTapFallback(): void {
    try {
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
        }
      );
    } catch (error) {
      console.error('Fallback sign-in failed:', error);
    }
  }

  // تسجيل الخروج
  public signOut(): void {
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
  }

  // التحقق من حالة التهيئة
  public isReady(): boolean {
    return this.isInitialized && !!window.google;
  }
}

// إضافة types للـ Google Identity Services
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}