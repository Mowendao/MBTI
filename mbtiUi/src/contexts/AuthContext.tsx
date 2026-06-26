import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, TestResult } from '@/types/mbti';
import api from '@/services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (email: string, name: string, password?: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  addTestResult: (result: TestResult) => void;
  testResults: TestResult[];
  isLoading: boolean;
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
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化: 检查本地 token
  useEffect(() => {
    const savedToken = localStorage.getItem('mbti_token');
    if (savedToken) {
      setToken(savedToken);
      // 用 token 获取用户信息
      api.get('/auth/me')
        .then(res => {
          const userData = res.data.data;
          setUser(userData);
          localStorage.setItem('mbti_user', JSON.stringify(userData));
        })
        .catch(() => {
          // token 无效，清除
          localStorage.removeItem('mbti_token');
          localStorage.removeItem('mbti_user');
          setToken(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const data = res.data.data;
      setToken(data.token);
      setUser({ id: String(data.userId), name: data.name, email: data.email, role: data.role, testResults: [], createdAt: '' });
      localStorage.setItem('mbti_token', data.token);
      localStorage.setItem('mbti_user', JSON.stringify({ id: String(data.userId), name: data.name, email: data.email, role: data.role }));
      return { ok: true };
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || '登录失败';
      return { ok: false, error: msg };
    }
  };

  const register = async (email: string, name: string, password?: string): Promise<{ ok: boolean; error?: string }> => {
    try {
      const res = await api.post('/auth/register', { email, password, name });
      const data = res.data.data;
      setToken(data.token);
      setUser({ id: String(data.userId), name: data.name, email: data.email, role: data.role, testResults: [], createdAt: '' });
      localStorage.setItem('mbti_token', data.token);
      localStorage.setItem('mbti_user', JSON.stringify({ id: String(data.userId), name: data.name, email: data.email, role: data.role }));
      return { ok: true };
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || '注册失败';
      return { ok: false, error: msg };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('mbti_token');
    localStorage.removeItem('mbti_user');
  };

  const addTestResult = (result: TestResult) => {
    // 结果会通过 API 提交，此处只做本地更新用于显示
    if (user) {
      const updatedUser = { ...user, testResults: [...(user.testResults || []), result] };
      setUser(updatedUser);
    }
  };

  const testResults = user?.testResults || [];

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        addTestResult,
        testResults,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
