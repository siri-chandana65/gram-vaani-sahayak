
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { logSecurityEvent } from '@/utils/security';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isLoading: boolean; // Add this missing property
  signUp: (email: string, password: string, userData: { full_name: string; phone?: string; location?: string; }) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Log security events
        if (event === 'SIGNED_IN') {
          logSecurityEvent('user_signed_in', { 
            userId: session?.user?.id,
            email: session?.user?.email 
          });
        } else if (event === 'SIGNED_OUT') {
          logSecurityEvent('user_signed_out');
        } else if (event === 'TOKEN_REFRESHED') {
          logSecurityEvent('token_refreshed');
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData: { full_name: string; phone?: string; location?: string; }) => {
    const redirectUrl = `${window.location.origin}/`;
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: userData,
        },
      });
      
      if (error) {
        logSecurityEvent('signup_failed', { 
          email, 
          error: error.message 
        });
      } else {
        logSecurityEvent('signup_successful', { email });
      }
      
      return { error };
    } catch (error) {
      logSecurityEvent('signup_error', { 
        email, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        logSecurityEvent('signin_failed', { 
          email, 
          error: error.message 
        });
      } else {
        logSecurityEvent('signin_successful', { email });
      }
      
      return { error };
    } catch (error) {
      logSecurityEvent('signin_error', { 
        email, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      logSecurityEvent('signout_successful');
    } catch (error) {
      logSecurityEvent('signout_error', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  };

  const value = {
    user,
    session,
    loading,
    isLoading: loading, // Map loading to isLoading for backward compatibility
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
