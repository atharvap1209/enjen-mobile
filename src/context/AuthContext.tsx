import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface AuthUser {
  organisationId: string;
  phoneNumber: string;
  displayName?: string;
  role?: 'OPERATOR' | 'QC_INSPECTOR' | 'WAREHOUSE_WORKER';
}

export interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (args: { organisationId: string; phoneNumber: string; otp: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (args: { organisationId: string; phoneNumber: string; otp: string }) => {
    setIsLoading(true);
    try {
      // Mock OTP validation: OTP must be "1234"
      if (args.otp !== '1234') {
        throw new Error('Invalid OTP');
      }

      // Set on successful login
      setUser({
        organisationId: args.organisationId,
        phoneNumber: args.phoneNumber,
        // role can be set later if needed
      });
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value: AuthContextValue = {
    user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

