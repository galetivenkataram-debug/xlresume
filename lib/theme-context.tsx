'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeMode = 'dark' | 'light';

interface ThemeContextType {
  isDark: boolean;
  toggle: () => void;
  mode: ThemeMode;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  toggle: () => {},
  mode: 'dark',
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('xlresume-theme');
    if (stored) {
      setIsDark(stored === 'dark');
    } else {
      // Respect system preference on first visit
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('xlresume-theme', next ? 'dark' : 'light');
    // Also set on document for CSS variable support
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
  };

  if (!mounted) return null;

  return (
    <ThemeContext.Provider value={{ isDark, toggle, mode: isDark ? 'dark' : 'light' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

// ─── Token sets ───────────────────────────────────────────────────────────────
export const DARK_THEME = {
  bg:           '#0a0a0b',
  bg2:          '#111113',
  bg3:          '#18181c',
  border:       '#1e1e24',
  border2:      '#2a2a34',
  text:         '#f0efec',
  textSub:      '#888898',
  textMuted:    '#404050',
  accent:       '#ff4500',
  accentB:      '#fb923c',
  accentC:      '#facc15',
  accentAlt:    '#c084fc',   // violet for variety
  accentAlt2:   '#f472b6',   // fuchsia
  accentBg:     'rgba(255,69,0,0.1)',
  accentBorder: 'rgba(255,69,0,0.25)',
  glass:        'rgba(255,255,255,0.03)',
  glassBorder:  'rgba(255,255,255,0.08)',
  nav:          'rgba(10,10,11,0.88)',
  success:      '#22c55e',
  card:         '#111113',
  cardBorder:   '#1e1e24',
  shadow:       '0 32px 80px rgba(0,0,0,0.7)',
};

export const LIGHT_THEME = {
  bg:           '#ffffff',
  bg2:          '#f8f7ff',   // very subtle violet tint
  bg3:          '#f0eeff',
  border:       '#e4e2f4',
  border2:      '#ccc8ee',
  text:         '#0f0e18',
  textSub:      '#4a4860',
  textMuted:    '#9896b0',
  accent:       '#e03500',   // deeper orange-red for light
  accentB:      '#dd6b20',
  accentC:      '#b45309',
  accentAlt:    '#7c3aed',   // vibrant violet
  accentAlt2:   '#db2777',   // vibrant fuchsia
  accentBg:     'rgba(124,58,237,0.08)',
  accentBorder: 'rgba(124,58,237,0.2)',
  glass:        'rgba(124,58,237,0.04)',
  glassBorder:  'rgba(124,58,237,0.12)',
  nav:          'rgba(255,255,255,0.92)',
  success:      '#16a34a',
  card:         '#ffffff',
  cardBorder:   '#e4e2f4',
  shadow:       '0 24px 60px rgba(100,80,200,0.12)',
};

export type ThemeTokens = typeof DARK_THEME;