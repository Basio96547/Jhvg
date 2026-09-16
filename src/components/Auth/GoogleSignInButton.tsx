import React, { useEffect, useState } from 'react';
import { Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { GoogleAuthService } from '../../services/googleAuthService';
import { useAuth } from '../../contexts/AuthContext';

interface GoogleSignInButtonProps {
  onClose: () => void;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const { loginWithPhone, registerWithPhone } = useAuth();
  const googleAuthService = GoogleAuthService.getInstance();

  useEffect(() => {
    // تهيئة Google Auth
    const initializeGoogle = async () => {
      try {
        await googleAuthService.initialize();
        setIsInitialized(true);
      } catch (error) {
        console.error('Google Auth initialization failed:', error);
        setError(error instanceof Error ? error.message : 'فشل في تهيئة تسجيل الدخول عبر Google');
      }
    };

    initializeGoogle();

    // الاستماع لأحداث Google Auth
    const handleGoogleSuccess = async (event: any) => {
      const userInfo = event.detail;
      setIsLoading(true);
      setError('');

      try {
        // التحقق من وجود المستخدم
        const userKey = `google_user_${userInfo.id}`;
        const existingUser = localStorage.getItem(userKey);

        if (existingUser) {
          // تسجيل دخول مستخدم موجود
          const userData = JSON.parse(existingUser);
          await loginWithPhone(userData.phone || userInfo.email, userData);
        } else {
          // مستخدم جديد
          const userData = {
            id: userInfo.id,
            email: userInfo.email,
            name: userInfo.name,
            avatar: userInfo.avatar,
            phone: userInfo.email, // استخدام البريد كمعرف مؤقت
            location: '',
            bio: '',
            rating: 5.0,
            reviewCount: 0,
            joinDate: new Date().toISOString(),
            provider: 'google',
            emailVerified: userInfo.emailVerified,
          };

          // حفظ بيانات المستخدم
          localStorage.setItem(userKey, JSON.stringify(userData));
          
          await registerWithPhone(userInfo.email, userData);
        }

        onClose();
      } catch (error) {
        console.error('Google sign-in error:', error);
        setError('فشل في تسجيل الدخول عبر Google');
      } finally {
        setIsLoading(false);
      }
    };

    const handleGoogleError = (event: any) => {
      setError(event.detail.error);
      setIsLoading(false);
    };

    window.addEventListener('googleAuthSuccess', handleGoogleSuccess);
    window.addEventListener('googleAuthError', handleGoogleError);

    return () => {
      window.removeEventListener('googleAuthSuccess', handleGoogleSuccess);
      window.removeEventListener('googleAuthError', handleGoogleError);
    };
  }, []);

  const handleGoogleSignIn = async () => {
    if (!isInitialized) {
      setError('Google Auth لم يتم تهيئته بعد');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await googleAuthService.signIn();
    } catch (error) {
      console.error('Google sign-in failed:', error);
      setError('فشل في تسجيل الدخول عبر Google');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* زر Google الرئيسي */}
      <button
        onClick={handleGoogleSignIn}
        disabled={!isInitialized || isLoading}
        className="w-full flex items-center justify-center space-x-3 space-x-reverse px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-400 border-t-transparent"></div>
        ) : (
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        <span className="font-medium text-gray-700 group-hover:text-gray-900">
          {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول عبر Google'}
        </span>
      </button>

      {/* زر Google البديل (مخفي) */}
      <div id="google-signin-button" className="hidden"></div>

      {/* رسائل الخطأ */}
      {error && (
        <div className="flex items-center space-x-2 space-x-reverse text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* معلومات إضافية */}
      <div className="text-xs text-gray-500 text-center">
        <div className="flex items-center justify-center space-x-2 space-x-reverse mb-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span>آمن ومحمي بواسطة Google</span>
        </div>
        <p>
          سيتم استخدام اسمك وبريدك الإلكتروني من حساب Google الخاص بك
        </p>
      </div>
    </div>
  );
};

export default GoogleSignInButton;