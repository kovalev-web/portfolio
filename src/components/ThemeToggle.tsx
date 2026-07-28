import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import './theme-toggle.css';

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
    >
      {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}
