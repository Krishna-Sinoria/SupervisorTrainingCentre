import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for testing
const demoUsers: User[] = [
  {
    id: '1',
    email: 'director@stc.railway.gov.in',
    name: 'Director STC',
    role: 'director',
    position: 'Director',
    phone: '+91-9876543200',
    address: 'Director Quarters, STC Campus, Northern Railway',
    department: 'Administration',
    joinDate: '2015-01-15',
    active: true
  },
  {
    id: '2',
    email: 'trainer1@stc.railway.gov.in',
    name: 'Rajesh Kumar',
    role: 'trainer',
    position: 'Senior Trainer',
    phone: '+91-9876543201',
    address: 'Staff Quarters Block A, STC Campus',
    department: 'Mechanical',
    joinDate: '2020-03-15',
    active: true
  },
  {
    id: '3',
    email: 'trainer2@stc.railway.gov.in',
    name: 'Priya Sharma',
    role: 'trainer',
    position: 'Trainer',
    phone: '+91-9876543202',
    address: 'Staff Quarters Block B, STC Campus',
    department: 'Electrical',
    joinDate: '2021-07-20',
    active: true
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('stc_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Demo authentication - in production, this would be a real API call
    const foundUser = demoUsers.find(u => u.email === email);
    if (foundUser && password === 'password123') {
      setUser(foundUser);
      localStorage.setItem('stc_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('stc_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('stc_user', JSON.stringify(updatedUser));
      
      // Update in demo users array for consistency
      const userIndex = demoUsers.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        demoUsers[userIndex] = updatedUser;
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};