import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const storedTheme = localStorage.getItem("theme") as Theme;
      return storedTheme || defaultTheme;
    } catch {
      return defaultTheme;
    }
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Clear existing theme classes
    root.classList.remove("light", "dark");
    
    // Add new theme class
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.add("light");
    }
    
    // Also set data attribute for better CSS targeting
    root.setAttribute("data-theme", theme);
    
    try {
      localStorage.setItem("theme", theme);
      console.log("Theme applied:", theme, "Classes:", root.className);
    } catch (error) {
      console.warn("Failed to save theme to localStorage:", error);
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      console.log("Setting theme to:", newTheme);
      setTheme(newTheme);
      
      // Force immediate DOM update
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      if (newTheme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.add("light");
      }
      console.log("Forced theme update:", newTheme, "Classes:", root.className);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
    
  return context;
};
