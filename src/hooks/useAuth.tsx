import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/index';
import { logAuditEvent } from '../services/auditLogger';
import { AUTH_TOKEN_KEY, buildApiUrl } from '../config/api.config';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Secure token storage
 * TODO: Replace localStorage with HttpOnly cookies for production
 * HttpOnly cookies prevent XSS attacks by making tokens inaccessible to JavaScript
 *
 * Production implementation should:
 * 1. Set tokens in HttpOnly cookies on the server
 * 2. Use SameSite=Strict for CSRF protection
 * 3. Set Secure flag to ensure HTTPS-only transmission
 * 4. Implement token rotation and short expiration times
 */
const TokenStorage = {
  getToken(): string | null {
    // TODO: In production, token will be in HttpOnly cookie, not accessible here
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  setToken(token: string): void {
    // TODO: In production, this will be set by server as HttpOnly cookie
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  },

  removeToken(): void {
    // TODO: In production, clear cookie via server endpoint
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },

  getUser(): User | null {
    const savedUser = localStorage.getItem('current_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (error) {
        console.error('Failed to parse saved user', error);
        return null;
      }
    }
    return null;
  },

  setUser(user: User): void {
    localStorage.setItem('current_user', JSON.stringify(user));
  },

  removeUser(): void {
    localStorage.removeItem('current_user');
  },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = TokenStorage.getToken();
    const savedUser = TokenStorage.getUser();
    if (token && savedUser) {
      setUser(savedUser);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch(buildApiUrl('/api/auth/login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Invalid credentials');
    }

    const { data } = await response.json();
    TokenStorage.setToken(data.token);
    TokenStorage.setUser(data.user);
    setUser(data.user);

    // Log successful login
    await logAuditEvent({
      userId: data.user.id,
      userName: data.user.name,
      userRole: data.user.role,
      action: 'Login',
      resource: 'Authentication',
      resourceId: data.user.id,
      details: `User logged in successfully`,
    });
  };

  const logout = async () => {
    const token = TokenStorage.getToken();
    const currentUser = user;

    if (token && currentUser) {
      try {
        // Log logout before clearing user data
        await logAuditEvent({
          userId: currentUser.id,
          userName: currentUser.name,
          userRole: currentUser.role,
          action: 'Logout',
          resource: 'Authentication',
          resourceId: currentUser.id,
          details: `User logged out`,
        });

        await fetch(buildApiUrl('/api/auth/logout'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ token }),
        });
      } catch (error) {
        console.error('Logout request failed', error);
      }
    }

    TokenStorage.removeToken();
    TokenStorage.removeUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
