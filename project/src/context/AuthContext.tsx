import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  employeeId: string;
  name?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  login: (employeeId: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage on mount
    const savedUser = localStorage.getItem('dicomUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('dicomUser');
      }
    }
    setIsLoading(false);
  }, []);

  // Mock login function for demonstration
  const login = async (employeeId: string, password: string): Promise<boolean> => {
    // In a real application, this would make a request to your authentication API
    
    // For demo purposes, accept any credentials with basic validation
    if (employeeId && password && password.length >= 6) {
      const mockUser: User = {
        employeeId,
        name: `Dr. ${employeeId}`,
        role: 'Radiologist'
      };
      
      setUser(mockUser);
      localStorage.setItem('dicomUser', JSON.stringify(mockUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dicomUser');
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};