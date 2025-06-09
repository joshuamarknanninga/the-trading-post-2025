// frontend/src/context/ThemeContext.tsx

import React, { createContext, useState, ReactNode } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

// Define the context shape
interface ThemeContextValue {
  theme: ColorSchemeName;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: Appearance.getColorScheme(),
  toggleTheme: () => {},
});

interface ProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<ColorSchemeName>(Appearance.getColorScheme());

  const toggleTheme = () => {
    setTheme(current => (current === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
