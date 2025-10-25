import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText, Download, Calendar, TrendingUp, Users, DollarSign } from 'lucide-react';
import { api } from '../services/api';
import Layout from '../components/layout/Layout';

type ReportType = 'revenue' | 'patients' | 'encounters' | 'labs';

const ReportsPage = () => {
  const [selectedReport, setSelectedReport] = useState<ReportType>('revenue');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data: bills } = useQuery({
    queryKey: ['bills'],
    queryFn: () => api.getBills(),
  });

  const { data: patients } = useQuery({
    queryKey: ['patients'],
    queryFn: () => api.getPatients(),
  });

  const { data: encounters } = useQuery({
    queryKey: ['encounters'],
    queryFn: () => api.getEncounters(),
  });

  const { data: labs } = useQuery({
    queryKey: ['labs'],
    queryFn: () => api.getLabResults(),
  });

  const reportTypes = [
    { id: 'revenue', name: 'Revenue Report', icon: DollarSign, color: 'bg-green-500' },
    { id: 'patients', name: 'Patient Report', icon: Users, color: 'bg-blue-500' },
    { id: 'encounters', name: 'Encounters Report', icon: TrendingUp, color: 'bg-purple-500' },
    { id: 'labs', name: 'Lab Report', icon: FileText, color: 'bg-yellow-500' },
  ];

  const handleExport = () => {
    // Mock export functionality
    alert('Report exported successfully!');
  };

  const getRevenueData = () => {
    const totalRevenue = bills?.reduce((sum, bill) => sum + bill.total, 0) || 0;
    const paidRevenue = bills?.filter(b => b.status === 'paid').reduce((sum, bill) => sum + bill.total, 0) || 0;
    const pendingRevenue = bills?.filter(b => b.status === 'pending').reduce((sum, bill) => sum + bill.total, 0) || 0;

    return {
      total: totalRevenue,
      paid: paidRevenue,
      pending: pendingRevenue,
      count: bills?.length || 0,
    };
  };

  const getPatientData = () => {
    const totalPatients = patients?.length || 0;
    const maleCount = patients?.filter(p => p.gender === 'male').length || 0;
    const femaleCount = patients?.filter(p => p.gender === 'female').length || 0;

    return {
      total: totalPatients,
      male: maleCount,
      female: femaleCount,
    };
  };

  const getEncounterData = () => {
    const totalEncounters = encounters?.length || 0;
    const completedCount = encounters?.filter(e => e.status === 'completed').length || 0;
    const inProgressCount = encounters?.filter(e => e.status === 'in-progress').length || 0;
    const scheduledCount = encounters?.filter(e => e.status === 'scheduled').length || 0;

    return {
      total: totalEncounters,
      completed: completedCount,
      inProgress: inProgressCount,
      scheduled: scheduledCount,
    };
  };

  const getLabData = () => {
    const totalLabs = labs?.length || 0;
    const completedCount = labs?.filter(l => l.status === 'completed').length || 0;
    const pendingCount = labs?.filter(l => l.status === 'pending').length || 0;
    const inProgressCount = labs?.filter(l => l.status === 'in-progress').length || 0;

    return {
      total: totalLabs,
      completed: completedCount,
      pending: pendingCount,
      inProgress: inProgressCount,
    };
  };

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'revenue': {
        const revenueData = getRevenueData();
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-400">Total Revenue</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-200">₹{revenueData.total.toFixed(2)}</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-400">Paid</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">₹{revenueData.paid.toFixed(2)}</p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                <p className="text-sm text-orange-700 dark:text-orange-400">Pending</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-200">₹{revenueData.pending.toFixed(2)}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Bills: {revenueData.count}</p>
            </div>
          </div>
        );
      }

      case 'patients': {
        const patientData = getPatientData();
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-400">Total Patients</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">{patientData.total}</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <p className="text-sm text-purple-700 dark:text-purple-400">Male</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-200">{patientData.male}</p>
              </div>
              <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg">
                <p className="text-sm text-pink-700 dark:text-pink-400">Female</p>
                <p className="text-2xl font-bold text-pink-900 dark:text-pink-200">{patientData.female}</p>
              </div>
            </div>
          </div>
        );
      }

      case 'encounters': {
        const encounterData = getEncounterData();
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <p className="text-sm text-purple-700 dark:text-purple-400">Total Encounters</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-200">{encounterData.total}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-400">Completed</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-200">{encounterData.completed}</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-400">In Progress</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">{encounterData.inProgress}</p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <p className="text-sm text-yellow-700 dark:text-yellow-400">Scheduled</p>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-200">{encounterData.scheduled}</p>
              </div>
            </div>
          </div>
        );
      }

      case 'labs': {
        const labData = getLabData();
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <p className="text-sm text-yellow-700 dark:text-yellow-400">Total Lab Tests</p>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-200">{labData.total}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-400">Completed</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-200">{labData.completed}</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-400">In Progress</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">{labData.inProgress}</p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                <p className="text-sm text-orange-700 dark:text-orange-400">Pending</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-200">{labData.pending}</p>
              </div>
            </div>
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Reports</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Generate and view various hospital reports
          </p>
        </div>

        {/* Report Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedReport(type.id as ReportType)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedReport === type.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`${type.color} p-2 rounded-lg`}>
                    <Icon className="text-white" size={20} />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{type.name}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Date Range Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Date Range Filter
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="inline mr-2" size={16} />
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="inline mr-2" size={16} />
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleExport}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Download size={20} />
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            {reportTypes.find(t => t.id === selectedReport)?.name}
          </h2>
          {renderReportContent()}
        </div>
      </div>
    </Layout>
  );
};

export default ReportsPage;
