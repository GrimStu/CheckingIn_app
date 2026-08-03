import React, { createContext, useContext, useMemo } from 'react';
import { ColorScheme, ThemeColors, darkColors, lightColors, bodyFigure } from './tokens';

interface ThemeContextValue {
  scheme: ColorScheme;
  colors: ThemeColors;
  bodyFigureColors: { fill: string; stroke: string };
}

const ThemeContext = createContext<ThemeContextValue>({
  scheme: 'light',
  colors: lightColors,
  bodyFigureColors: bodyFigure.light,
});

export function ThemeProvider({
  dark,
  children,
}: {
  dark: boolean;
  children: React.ReactNode;
}) {
  const value = useMemo<ThemeContextValue>(() => {
    const scheme: ColorScheme = dark ? 'dark' : 'light';
    return {
      scheme,
      colors: dark ? darkColors : lightColors,
      bodyFigureColors: dark ? bodyFigure.dark : bodyFigure.light,
    };
  }, [dark]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
