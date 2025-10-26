import { X } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { getShortcutDisplay, KeyboardShortcut } from '../../hooks/useKeyboardShortcuts';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: KeyboardShortcut[];
}

const KeyboardShortcutsModal = ({ isOpen, onClose, shortcuts }: KeyboardShortcutsModalProps) => {
  const { t } = useI18n();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 id="shortcuts-title" className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t('keyboard.shortcuts')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label={t('common.close')}
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left pb-3 text-gray-700 dark:text-gray-300 font-semibold">
                  Action
                </th>
                <th className="text-left pb-3 text-gray-700 dark:text-gray-300 font-semibold">
                  Shortcut
                </th>
              </tr>
            </thead>
            <tbody>
              {shortcuts.map((shortcut, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  <td className="py-3 text-gray-900 dark:text-gray-100">
                    {t(shortcut.description)}
                  </td>
                  <td className="py-3">
                    <kbd className="px-3 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm font-mono text-gray-900 dark:text-gray-100">
                      {getShortcutDisplay(shortcut)}
                    </kbd>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsModal;
