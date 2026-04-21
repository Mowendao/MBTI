import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, TestResult } from '../types/mbti';
import { storageService } from '../services/storage';

interface AuthContextType {
  user: User | null;
  login: (email: string, name: string) => void;
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 初始化时从存储中获取当前用户
    const currentUser = storageService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = (email: string, name: string) => {
    // 查找用户，如果不存在则创建新用户
    let existingUser = storageService.findUserByEmail(email);
    
    if (!existingUser) {
      existingUser = {
        id: Date.now().toString(),
        name,
        email,
        testResults: [],
        createdAt: new Date().toISOString()
      };
      storageService.saveUser(existingUser);
    }
    
    storageService.setCurrentUser(existingUser);
    setUser(existingUser);
  };

  const logout = () => {
    storageService.clearCurrentUser();
    setUser(null);
  };

  const addTestResult = (result: TestResult) => {
    if (user) {
      storageService.addTestResult(user.id, result);
      // 更新用户状态
      const updatedUser = storageService.getCurrentUser();
      if (updatedUser) {
        setUser(updatedUser);
      }
    }
  };

  const testResults = user?.testResults || [];

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
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
