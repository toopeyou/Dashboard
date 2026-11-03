import { useEffect, useState } from "react";

const THEME_KEY = "metrics-dashboard-theme";

export default function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_KEY);

      return savedTheme === "light" || savedTheme === "dark"
        ? savedTheme
        : "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark"
    );
  };
  return { theme, toggleTheme };
}