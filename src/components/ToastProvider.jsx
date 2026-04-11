import { ToastContainer } from "react-toastify";
import { useTheme } from "../contexts/ThemeContext";

export default function ToastProvider() {
  const { isDark } = useTheme();

  return (
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      theme={isDark ? "dark" : "light"}
      toastStyle={{
        background: isDark ? "var(--bg-card)" : "#ffffff",
        border: isDark ? "1px solid var(--border-color)" : "1px solid #e0e0e0",
        color: isDark ? "var(--text-primary)" : "#000000",
      }}
      progressClassName={isDark ? "toastProgress" : "toastProgressLight"}
    />
  );
}
