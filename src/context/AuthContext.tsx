import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { UserProfile, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isStandaloneMode: boolean;
  login: (email: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default team users for AndisLab Workspace
const DEFAULT_TEAM_USERS: Record<string, UserProfile> = {
  'ahnaf@andislab.com': {
    id: 'usr-ahnaf',
    email: 'ahnaf@andislab.com',
    full_name: 'Ahnaf (Programmer & Super Admin)',
    role: 'superadmin',
    position: 'Lead Programmer & System Architect'
  },
  'kukuh@andislab.com': {
    id: 'usr-kukuh',
    email: 'kukuh@andislab.com',
    full_name: 'Mas Kukuh',
    role: 'admin',
    position: 'Manager Sales & Operasional'
  },
  'setiyo@andislab.com': {
    id: 'usr-setiyo',
    email: 'setiyo@andislab.com',
    full_name: 'Pak Setiyo',
    role: 'admin',
    position: 'Director & General Manager'
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('andislab_user');
    if (saved) {
      try { return JSON.parse(saved); } catch { return null; }
    }
    // Default user: Ahnaf
    return DEFAULT_TEAM_USERS['ahnaf@andislab.com'];
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isStandaloneMode = !isSupabaseConfigured;

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    // Check active Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email || '');
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email || '');
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data && !error) {
        const profile: UserProfile = {
          id: data.id,
          email,
          full_name: data.full_name || email.split('@')[0],
          role: data.role || 'staff',
          avatar_url: data.avatar_url
        };
        setUser(profile);
        localStorage.setItem('andislab_user', JSON.stringify(profile));
      } else {
        const defaultProfile: UserProfile = {
          id: userId,
          email,
          full_name: email.split('@')[0],
          role: 'staff'
        };
        setUser(defaultProfile);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, role: UserRole = 'staff') => {
    setIsLoading(true);
    if (!isSupabaseConfigured) {
      const teamUser = DEFAULT_TEAM_USERS[email] || {
        id: `usr-${Date.now()}`,
        email,
        full_name: email.split('@')[0],
        role
      };
      setUser(teamUser);
      localStorage.setItem('andislab_user', JSON.stringify(teamUser));
      setIsLoading(false);
      return;
    }

    try {
      const teamUser = DEFAULT_TEAM_USERS[email];
      if (teamUser) {
        setUser(teamUser);
        localStorage.setItem('andislab_user', JSON.stringify(teamUser));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (isSupabaseConfigured) {
      supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('andislab_user');
  };

  const switchRole = (newRole: UserRole) => {
    if (!user) return;
    const updated = { ...user, role: newRole };
    setUser(updated);
    localStorage.setItem('andislab_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isStandaloneMode, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
