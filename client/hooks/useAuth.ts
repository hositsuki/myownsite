import { useSession, signIn, signOut } from 'next-auth/react';
import { useCallback } from 'react';
import { useUIStore } from '@/store';

export interface AuthUser {
  email?: string | null;
  name?: string | null;
  image?: string | null;
}

export function useAuth() {
  const { data: session, status } = useSession();
  const { addNotification } = useUIStore();

  const login = useCallback(async (username: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        addNotification('error', result.error);
        return false;
      }

      addNotification('success', 'Successfully logged in');
      return true;
    } catch (error) {
      addNotification('error', 'Failed to login');
      return false;
    }
  }, [addNotification]);

  const logout = useCallback(async () => {
    try {
      await signOut({ redirect: false });
      addNotification('success', 'Successfully logged out');
    } catch (error) {
      addNotification('error', 'Failed to logout');
    }
  }, [addNotification]);

  return {
    user: session?.user as AuthUser | undefined,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    isAdmin: session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL,
    login,
    logout,
  };
}
