import { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import PatientHeader from '../common/PatientHeader';
import { Patient } from '../../types';
import { useI18n } from '../../hooks/useI18n';

interface LayoutProps {
  children: ReactNode;
  activePatient?: Patient | null;
  onClearPatient?: () => void;
}

const Layout = ({ children, activePatient, onClearPatient }: LayoutProps) => {
  const { t } = useI18n();
  const [skipLinkFocused, setSkipLinkFocused] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className={`sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg ${
          skipLinkFocused ? 'not-sr-only' : ''
        }`}
        onFocus={() => setSkipLinkFocused(true)}
        onBlur={() => setSkipLinkFocused(false)}
      >
        {t('accessibility.skipToContent')}
      </a>
      
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        {activePatient && onClearPatient && (
          <PatientHeader patient={activePatient} onClose={onClearPatient} />
        )}
        
        <main 
          id="main-content" 
          className="flex-1 p-8"
          role="main"
          aria-label={t('accessibility.mainContent')}
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
