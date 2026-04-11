import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("codefit-theme");
    return saved !== "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      root.removeAttribute("data-theme");
      // Dark mode CSS variables
      root.style.setProperty("--background", "#0a0e1a");
      root.style.setProperty("--foreground", "#ffffff");
      root.style.setProperty("--card", "#141d35");
      root.style.setProperty("--card-foreground", "#ffffff");
      root.style.setProperty("--popover", "#141d35");
      root.style.setProperty("--popover-foreground", "#ffffff");
      root.style.setProperty("--primary", "#6c63ff");
      root.style.setProperty("--primary-foreground", "#ffffff");
      root.style.setProperty("--secondary", "#1a2540");
      root.style.setProperty("--secondary-foreground", "#8892b0");
      root.style.setProperty("--muted", "#0f1629");
      root.style.setProperty("--muted-foreground", "#8892b0");
      root.style.setProperty("--accent", "#00d4ff");
      root.style.setProperty("--accent-foreground", "#ffffff");
      root.style.setProperty("--destructive", "#ff5252");
      root.style.setProperty("--destructive-foreground", "#ffffff");
      root.style.setProperty("--border", "rgba(108,99,255,0.15)");
      root.style.setProperty("--input", "rgba(255,255,255,0.05)");
      root.style.setProperty("--ring", "#6c63ff");
      localStorage.setItem("codefit-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
      // Light mode CSS variables
      root.style.setProperty("--background", "#f0f4f8");
      root.style.setProperty("--foreground", "#1a202c");
      root.style.setProperty("--card", "#ffffff");
      root.style.setProperty("--card-foreground", "#1a202c");
      root.style.setProperty("--popover", "#ffffff");
      root.style.setProperty("--popover-foreground", "#1a202c");
      root.style.setProperty("--primary", "#6c63ff");
      root.style.setProperty("--primary-foreground", "#ffffff");
      root.style.setProperty("--secondary", "#e8eef5");
      root.style.setProperty("--secondary-foreground", "#4a5568");
      root.style.setProperty("--muted", "#f0f4f8");
      root.style.setProperty("--muted-foreground", "#4a5568");
      root.style.setProperty("--accent", "#00c8ff");
      root.style.setProperty("--accent-foreground", "#003333");
      root.style.setProperty("--destructive", "#ff5252");
      root.style.setProperty("--destructive-foreground", "#ffffff");
      root.style.setProperty("--border", "rgba(0,212,255,0.2)");
      root.style.setProperty("--input", "rgba(0,0,0,0.05)");
      root.style.setProperty("--ring", "#6c63ff");
      localStorage.setItem("codefit-theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
