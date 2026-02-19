import React, { createContext, useContext, useState, type ReactNode } from 'react';

// 定义我们系统里的两大核心角色
export type Role = 'President' | 'Director';

interface AuthContextType {
  role: Role;
  setRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider Component
 * @description Global state manager for RBAC with LocalStorage persistence.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 懒加载初始化：优先从 LocalStorage 读取，没有则默认 President
  const [role, setRoleState] = useState<Role>(() => {
    const savedRole = localStorage.getItem('nova_hq_role');
    return (savedRole as Role) || 'President';
  });

  // 拦截 setRole，在更新 React 状态的同时，将其持久化到硬盘
  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    localStorage.setItem('nova_hq_role', newRole);
  };

  return (
    <AuthContext.Provider value={{ role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom Hook: useAuth
 * @description Allows any component to access or change the current user role.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};