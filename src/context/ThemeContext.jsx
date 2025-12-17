import React, { createContext, useContext, useState, useEffect } from 'react';


const ThemeContext = createContext();


export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};


export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  
  useEffect(() => {
    const theme = isDark ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    
    document.documentElement.setAttribute('data-theme', theme);
  }, [isDark]);

  
  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};