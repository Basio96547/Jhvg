import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  loginWithPhone: (phone: string, userData: any) => Promise<void>;
  registerWithPhone: (phone: string, userData: any) => Promise<void>;
  loginWithGoogle: (userData: any) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    // التحقق من وجود مستخدم محفوظ
    const checkStoredUser = () => {
      try {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setAuthState({
            user,
            isAuthenticated: true,
            loading: false,
          });
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            loading: false,
          });
        }
      } catch (error) {
        console.error('Error loading stored user:', error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          loading: false,
        });
      }
    };

    checkStoredUser();
  }, []);

  const loginWithPhone = async (phone: string, userData: any) => {
    try {
      const user: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        avatar: userData.avatar,
        phone: userData.phone,
        location: userData.location,
        bio: userData.bio,
        rating: userData.rating,
        reviewCount: userData.reviewCount,
        joinDate: userData.joinDate,
      };

      // حفظ المستخدم في التخزين المحلي
      localStorage.setItem('currentUser', JSON.stringify(user));

      setAuthState({
        user,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      throw error;
    }
  };

  const registerWithPhone = async (phone: string, userData: any) => {
    try {
      const user: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        avatar: userData.avatar,
        phone: userData.phone,
        location: userData.location || '',
        bio: userData.bio || '',
        rating: userData.rating,
        reviewCount: userData.reviewCount,
        joinDate: userData.joinDate,
      };

      // حفظ المستخدم في التخزين المحلي
      localStorage.setItem('currentUser', JSON.stringify(user));

      setAuthState({
        user,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      throw error;
    }
  };

  const loginWithGoogle = async (userData: any) => {
    try {
      const user: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        avatar: userData.avatar,
        phone: userData.phone || userData.email,
        location: userData.location || '',
        bio: userData.bio || '',
        rating: userData.rating || 5.0,
        reviewCount: userData.reviewCount || 0,
        joinDate: userData.joinDate || new Date().toISOString(),
      };

      // حفظ المستخدم في التخزين المحلي
      localStorage.setItem('currentUser', JSON.stringify(user));

      setAuthState({
        user,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      throw error;
    }
  };
  const logout = () => {
    localStorage.removeItem('currentUser');
    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false,
    });
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!authState.user) throw new Error('No user logged in');
    
    try {
      const updatedUser = { ...authState.user, ...updates };
      
      // تحديث في التخزين المحلي
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // تحديث بيانات المستخدم المحفوظة
      const userKey = `user_${authState.user.phone}`;
      const storedUserData = localStorage.getItem(userKey);
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        const updatedUserData = { ...userData, ...updates };
        localStorage.setItem(userKey, JSON.stringify(updatedUserData));
      }

      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    ...authState,
    loginWithPhone,
    registerWithPhone,
    loginWithGoogle,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};