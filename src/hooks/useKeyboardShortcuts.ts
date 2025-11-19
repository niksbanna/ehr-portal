import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  description: string;
  action: () => void;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl
          ? event.ctrlKey || event.metaKey
          : !event.ctrlKey && !event.metaKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

        if (ctrlMatch && altMatch && shiftMatch && keyMatch) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

// Global keyboard shortcuts hook
export const useGlobalShortcuts = () => {
  const navigate = useNavigate();

  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'd',
      alt: true,
      description: 'keyboard.dashboard',
      action: () => navigate('/'),
    },
    {
      key: 'p',
      alt: true,
      description: 'keyboard.patients',
      action: () => navigate('/patients'),
    },
    {
      key: 'e',
      alt: true,
      description: 'keyboard.encounters',
      action: () => navigate('/encounters'),
    },
    {
      key: 'l',
      alt: true,
      description: 'keyboard.labs',
      action: () => navigate('/labs'),
    },
    {
      key: 'r',
      alt: true,
      description: 'keyboard.prescriptions',
      action: () => navigate('/prescriptions'),
    },
    {
      key: 'b',
      alt: true,
      description: 'keyboard.billing',
      action: () => navigate('/billing'),
    },
  ];

  useKeyboardShortcuts(shortcuts);

  return shortcuts;
};

export const getShortcutDisplay = (shortcut: KeyboardShortcut): string => {
  const parts: string[] = [];
  if (shortcut.ctrl) parts.push('Ctrl');
  if (shortcut.alt) parts.push('Alt');
  if (shortcut.shift) parts.push('Shift');
  parts.push(shortcut.key.toUpperCase());
  return parts.join(' + ');
};
