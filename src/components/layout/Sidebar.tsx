import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  FlaskConical, 
  Pill, 
  Receipt,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/patients', icon: Users, label: 'Patients' },
    { path: '/encounters', icon: FileText, label: 'Encounters' },
    { path: '/labs', icon: FlaskConical, label: 'Lab Results' },
    { path: '/prescriptions', icon: Pill, label: 'Prescriptions' },
    { path: '/billing', icon: Receipt, label: 'Billing' },
  ];

  return (
    <div className="w-64 bg-blue-900 text-white min-h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold">EHR Portal</h1>
        <p className="text-blue-200 text-sm mt-1">Indian Hospital System</p>
      </div>

      <nav className="flex-1 px-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                isActive
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-100 hover:bg-blue-800'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-blue-800">
        <div className="mb-3">
          <p className="text-sm text-blue-200">Logged in as</p>
          <p className="font-medium">{user?.name}</p>
          <p className="text-xs text-blue-300">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 w-full px-4 py-2 bg-blue-800 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
