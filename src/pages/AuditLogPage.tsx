import { useState } from 'react';
import { Shield, Search, Calendar, User, FileText } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { List } from 'react-window';
import { AuditLogEntry } from '../types';

// Mock audit log data
const mockAuditLogs: AuditLogEntry[] = [
  {
    id: 'A001',
    userId: '1',
    userName: 'Dr. Rajesh Kumar',
    action: 'Created',
    resource: 'Patient',
    resourceId: 'P001',
    timestamp: '2024-10-25T09:30:00',
    details: 'Created new patient record for Amit Sharma',
    ipAddress: '192.168.1.100',
  },
  {
    id: 'A002',
    userId: '2',
    userName: 'Dr. Priya Sharma',
    action: 'Updated',
    resource: 'Encounter',
    resourceId: 'E001',
    timestamp: '2024-10-25T10:15:00',
    details: 'Updated encounter status to completed',
    ipAddress: '192.168.1.101',
  },
  {
    id: 'A003',
    userId: '3',
    userName: 'Nurse Anjali Singh',
    action: 'Created',
    resource: 'Lab Order',
    resourceId: 'L001',
    timestamp: '2024-10-25T11:00:00',
    details: 'Ordered Complete Blood Count test',
    ipAddress: '192.168.1.102',
  },
  {
    id: 'A004',
    userId: '1',
    userName: 'Dr. Rajesh Kumar',
    action: 'Created',
    resource: 'Prescription',
    resourceId: 'Rx001',
    timestamp: '2024-10-25T11:30:00',
    details: 'Created prescription with 2 medications',
    ipAddress: '192.168.1.100',
  },
  {
    id: 'A005',
    userId: '6',
    userName: 'Billing Staff Meera Joshi',
    action: 'Updated',
    resource: 'Bill',
    resourceId: 'B001',
    timestamp: '2024-10-25T12:00:00',
    details: 'Updated bill status to paid',
    ipAddress: '192.168.1.105',
  },
  {
    id: 'A006',
    userId: '2',
    userName: 'Dr. Priya Sharma',
    action: 'Viewed',
    resource: 'Patient',
    resourceId: 'P002',
    timestamp: '2024-10-25T13:15:00',
    details: 'Accessed patient chart',
    ipAddress: '192.168.1.101',
  },
  {
    id: 'A007',
    userId: '4',
    userName: 'Lab Tech Ramesh Patel',
    action: 'Updated',
    resource: 'Lab Result',
    resourceId: 'L002',
    timestamp: '2024-10-25T14:00:00',
    details: 'Updated lab result with test values',
    ipAddress: '192.168.1.103',
  },
  {
    id: 'A008',
    userId: '1',
    userName: 'Dr. Rajesh Kumar',
    action: 'Deleted',
    resource: 'Prescription',
    resourceId: 'Rx003',
    timestamp: '2024-10-25T14:30:00',
    details: 'Discontinued prescription',
    ipAddress: '192.168.1.100',
  },
];

// Generate more mock data for demonstration
const generateMoreLogs = (count: number): AuditLogEntry[] => {
  const actions = ['Created', 'Updated', 'Deleted', 'Viewed'];
  const resources = ['Patient', 'Encounter', 'Lab Order', 'Prescription', 'Bill'];
  const users = [
    { id: '1', name: 'Dr. Rajesh Kumar' },
    { id: '2', name: 'Dr. Priya Sharma' },
    { id: '3', name: 'Nurse Anjali Singh' },
  ];

  return Array.from({ length: count }, (_, i) => {
    const user = users[i % users.length];
    const action = actions[i % actions.length];
    const resource = resources[i % resources.length];
    const date = new Date();
    date.setMinutes(date.getMinutes() - i * 15);

    return {
      id: `A${String(i + 9).padStart(3, '0')}`,
      userId: user.id,
      userName: user.name,
      action,
      resource,
      resourceId: `${resource[0]}${String(i).padStart(3, '0')}`,
      timestamp: date.toISOString(),
      details: `${action} ${resource.toLowerCase()}`,
      ipAddress: `192.168.1.${100 + (i % 50)}`,
    };
  });
};

const allLogs = [...mockAuditLogs, ...generateMoreLogs(100)];

const AuditLogPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterResource, setFilterResource] = useState('all');

  const filteredLogs = allLogs.filter((log) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      log.userName.toLowerCase().includes(query) ||
      log.action.toLowerCase().includes(query) ||
      log.resource.toLowerCase().includes(query) ||
      log.details?.toLowerCase().includes(query) ||
      log.resourceId.toLowerCase().includes(query);

    const matchesAction = filterAction === 'all' || log.action === filterAction;
    const matchesResource = filterResource === 'all' || log.resource === filterResource;

    return matchesSearch && matchesAction && matchesResource;
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Created':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Updated':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Deleted':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Viewed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const log = filteredLogs[index];
    return (
      <div style={style} className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className={`px-2 py-1 rounded text-xs font-medium ${getActionColor(log.action)}`}>
                {log.action}
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {log.resource}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">#{log.resourceId}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{log.details}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <User size={12} />
                {log.userName}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {new Date(log.timestamp).toLocaleString()}
              </span>
              <span>IP: {log.ipAddress}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="text-blue-600 dark:text-blue-400" size={32} />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Audit Log</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track all system activities and user actions
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Search className="inline mr-2" size={16} />
                Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search logs..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FileText className="inline mr-2" size={16} />
                Action
              </label>
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="all">All Actions</option>
                <option value="Created">Created</option>
                <option value="Updated">Updated</option>
                <option value="Deleted">Deleted</option>
                <option value="Viewed">Viewed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FileText className="inline mr-2" size={16} />
                Resource
              </label>
              <select
                value={filterResource}
                onChange={(e) => setFilterResource(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="all">All Resources</option>
                <option value="Patient">Patient</option>
                <option value="Encounter">Encounter</option>
                <option value="Lab Order">Lab Order</option>
                <option value="Prescription">Prescription</option>
                <option value="Bill">Bill</option>
              </select>
            </div>
          </div>
        </div>

        {/* Audit Log List with react-window */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Activity Log ({filteredLogs.length} entries)
            </h2>
          </div>
          <div>
            {filteredLogs.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400">No audit logs found</p>
              </div>
            ) : (
              <List
                height={600}
                itemCount={filteredLogs.length}
                itemSize={120}
                width="100%"
                className="dark:bg-gray-800"
              >
                {Row}
              </List>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AuditLogPage;
