'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';

type AuthContextType = {
  user: any;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

// Cache for user data to prevent flicker during page transitions
let userCache: any = null;
let loadingCache = true;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(userCache);
  const [loading, setLoading] = useState(loadingCache);
  const supabase = createClient();

  useEffect(() => {
    // If we have cached user data and we're not in loading state, use it immediately
    if (userCache !== null && !loadingCache) {
      setUser(userCache);
      setLoading(false);
      return;
    }

    // Get initial user state
    const getUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      userCache = currentUser;
      loadingCache = false;
      setUser(currentUser);
      setLoading(false);
    };
    
    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        userCache = session?.user || null;
        loadingCache = false;
        setUser(userCache);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}