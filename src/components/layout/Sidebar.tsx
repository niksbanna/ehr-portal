import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  FlaskConical, 
  Pill, 
  Receipt,
  LogOut,
  Moon,
  Sun,
  Globe,
  HelpCircle
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useI18n } from '../../hooks/useI18n';
import { getNavigationItems } from '../../utils/permissions';
import { useGlobalShortcuts } from '../../hooks/useKeyboardShortcuts';
import KeyboardShortcutsModal from '../common/KeyboardShortcutsModal';

const iconMap = {
  LayoutDashboard,
  Users,
  FileText,
  FlaskConical,
  Pill,
  Receipt,
};

const Sidebar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useI18n();
  const [showShortcuts, setShowShortcuts] = useState(false);
  const shortcuts = useGlobalShortcuts();

  const menuItems = user ? getNavigationItems(user.role) : [];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <>
      <div className="w-64 bg-blue-900 dark:bg-gray-900 text-white min-h-screen flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold">{t('app.title')}</h1>
          <p className="text-blue-200 dark:text-gray-400 text-sm mt-1">{t('app.subtitle')}</p>
        </div>

        <nav className="flex-1 px-4" role="navigation" aria-label={t('accessibility.mainNavigation')}>
          {menuItems.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  isActive
                    ? 'bg-blue-700 dark:bg-gray-700 text-white'
                    : 'text-blue-100 dark:text-gray-300 hover:bg-blue-800 dark:hover:bg-gray-800'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={20} aria-hidden="true" />
                <span>{t(item.label)}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 space-y-3 border-t border-blue-800 dark:border-gray-800">
          <div className="flex gap-2">
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center flex-1 px-3 py-2 bg-blue-800 dark:bg-gray-800 rounded-lg hover:bg-blue-700 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label={t('theme.toggle')}
              title={theme === 'light' ? t('theme.dark') : t('theme.light')}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button
              onClick={toggleLanguage}
              className="flex items-center justify-center flex-1 px-3 py-2 bg-blue-800 dark:bg-gray-800 rounded-lg hover:bg-blue-700 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label={language === 'en' ? t('language.hindi') : t('language.english')}
              title={language === 'en' ? t('language.hindi') : t('language.english')}
            >
              <Globe size={18} />
              <span className="ml-1 text-xs">{language === 'en' ? 'हि' : 'EN'}</span>
            </button>
            <button
              onClick={() => setShowShortcuts(true)}
              className="flex items-center justify-center flex-1 px-3 py-2 bg-blue-800 dark:bg-gray-800 rounded-lg hover:bg-blue-700 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label={t('keyboard.shortcuts')}
              title={t('keyboard.shortcuts')}
            >
              <HelpCircle size={18} />
            </button>
          </div>
          
          <div className="mb-3">
            <p className="text-sm text-blue-200 dark:text-gray-400">{t('auth.loggedInAs')}</p>
            <p className="font-medium">{user?.name}</p>
            <p className="text-xs text-blue-300 dark:text-gray-500">{user?.email}</p>
            <p className="text-xs text-blue-300 dark:text-gray-500 mt-1">
              {t(`roles.${user?.role.replace('_', '') || 'admin'}`)}
            </p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-4 py-2 bg-blue-800 dark:bg-gray-800 rounded-lg hover:bg-blue-700 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label={t('common.logout')}
          >
            <LogOut size={18} aria-hidden="true" />
            <span>{t('common.logout')}</span>
          </button>
        </div>
      </div>

      <KeyboardShortcutsModal
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
        shortcuts={shortcuts}
      />
    </>
  );
};

export default Sidebar;
