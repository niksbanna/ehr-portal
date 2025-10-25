import { useState } from 'react';
import { Settings as SettingsIcon, Moon, Sun, Globe, Bell, Clock, Calendar as CalendarIcon, Save } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useTheme } from '../hooks/useTheme';
import { useI18n } from '../hooks/useI18n';

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useI18n();
  
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });
  
  const [dateFormat, setDateFormat] = useState('DD-MM-YYYY');
  const [timeFormat, setTimeFormat] = useState('12h');

  const handleSaveSettings = () => {
    // Save settings logic
    alert('Settings saved successfully!');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your application preferences
          </p>
        </div>

        {/* Theme Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Appearance
              </h2>
            </div>
          </div>
          <div className="p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Theme
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setTheme('light')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  theme === 'light'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <Sun className="mx-auto mb-2" size={24} />
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Light</p>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  theme === 'dark'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <Moon className="mx-auto mb-2" size={24} />
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Dark</p>
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  theme === 'system'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <SettingsIcon className="mx-auto mb-2" size={24} />
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">System</p>
              </button>
            </div>
          </div>
        </div>

        {/* Language Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Globe size={20} />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Language & Region
              </h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'hi')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <CalendarIcon className="inline mr-2" size={16} />
                Date Format
              </label>
              <select
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="DD-MM-YYYY">DD-MM-YYYY (Indian)</option>
                <option value="MM-DD-YYYY">MM-DD-YYYY (US)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Clock className="inline mr-2" size={16} />
                Time Format
              </label>
              <select
                value={timeFormat}
                onChange={(e) => setTimeFormat(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="12h">12 Hour (AM/PM)</option>
                <option value="24h">24 Hour</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Bell size={20} />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Notifications
              </h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Email Notifications</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive email alerts for important events
                </p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, email: !notifications.email })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.email ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.email ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">SMS Notifications</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive SMS alerts for urgent matters
                </p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, sms: !notifications.sms })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.sms ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.sms ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Push Notifications</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive push notifications in your browser
                </p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, push: !notifications.push })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.push ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.push ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveSettings}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Save size={20} />
            Save Settings
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
