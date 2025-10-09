
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');
  const { user } = useAuth();

  useEffect(() => {
    // Load theme from user preferences or localStorage
    const loadTheme = async () => {
      if (user) {
        try {
          const { data } = await supabase
            .from('user_preferences')
            .select('theme')
            .eq('user_id', user.id)
            .single();
          
          if (data?.theme) {
            setThemeState(data.theme as 'light' | 'dark');
            document.documentElement.classList.toggle('dark', data.theme === 'dark');
          }
        } catch (error) {
          if (import.meta.env.DEV) {
            console.error('Error loading theme:', error);
          }
        }
      } else {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        if (savedTheme) {
          setThemeState(savedTheme);
          document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        }
      }
    };

    loadTheme();
  }, [user]);

  const setTheme = async (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    
    if (user) {
      try {
        await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            theme: newTheme
          });
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error saving theme:', error);
        }
      }
    } else {
      localStorage.setItem('theme', newTheme);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const value = {
    theme,
    toggleTheme,
    setTheme
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
