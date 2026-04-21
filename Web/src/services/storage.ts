import { User, TestResult } from '../types/mbti';

const USERS_KEY = 'mbti_users';
const CURRENT_USER_KEY = 'mbti_current_user';

export const storageService = {
  // 获取所有用户
  getUsers(): User[] {
    const usersJson = localStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  },

  // 保存用户
  saveUser(user: User): void {
    const users = this.getUsers();
    const existingUserIndex = users.findIndex(u => u.id === user.id);
    
    if (existingUserIndex >= 0) {
      users[existingUserIndex] = user;
    } else {
      users.push(user);
    }
    
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  // 根据邮箱查找用户
  findUserByEmail(email: string): User | undefined {
    const users = this.getUsers();
    return users.find(user => user.email === email);
  },

  // 获取当前登录用户
  getCurrentUser(): User | null {
    const userJson = localStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  },

  // 设置当前登录用户
  setCurrentUser(user: User): void {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  },

  // 清除当前登录用户
  clearCurrentUser(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // 为用户添加测试结果
  addTestResult(userId: string, result: TestResult): void {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex >= 0) {
      users[userIndex].testResults = [...(users[userIndex].testResults || []), result];
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      // 如果是当前用户，也更新当前用户的测试结果
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        currentUser.testResults = users[userIndex].testResults;
        this.setCurrentUser(currentUser);
      }
    }
  },

  // 获取用户的测试历史
  getUserTestHistory(userId: string): TestResult[] {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    return user?.testResults || [];
  }
};
