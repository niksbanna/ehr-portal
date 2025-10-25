import { useQuery } from '@tanstack/react-query';
import { Users, Calendar, FlaskConical, DollarSign } from 'lucide-react';
import { api } from '../../services/api';
import Layout from '../../components/layout/Layout';
import { format } from 'date-fns';

const DashboardPage = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.getDashboardStats(),
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </Layout>
    );
  }

  const statsCards = [
    {
      title: 'Total Patients',
      value: stats?.totalPatients || 0,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: "Today's Appointments",
      value: stats?.todayAppointments || 0,
      icon: Calendar,
      color: 'bg-green-500',
    },
    {
      title: 'Pending Lab Results',
      value: stats?.pendingLabs || 0,
      icon: FlaskConical,
      color: 'bg-yellow-500',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats?.totalRevenue.toLocaleString('en-IN') || 0}`,
      icon: DollarSign,
      color: 'bg-purple-500',
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome to EHR Portal</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {card.value}
                    </p>
                  </div>
                  <div className={`${card.color} p-3 rounded-lg`}>
                    <Icon className="text-white" size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Encounters
              </h2>
            </div>
            <div className="p-6">
              {stats?.recentEncounters.length === 0 ? (
                <p className="text-gray-500">No recent encounters</p>
              ) : (
                <div className="space-y-4">
                  {stats?.recentEncounters.map((encounter) => (
                    <div
                      key={encounter.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {encounter.patientName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {encounter.chiefComplaint}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(encounter.date), 'PPp')}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          encounter.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : encounter.status === 'in-progress'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {encounter.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Patients
              </h2>
            </div>
            <div className="p-6">
              {stats?.recentPatients.length === 0 ? (
                <p className="text-gray-500">No recent patients</p>
              ) : (
                <div className="space-y-4">
                  {stats?.recentPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {patient.firstName} {patient.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{patient.phone}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {patient.city}, {patient.state}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Patient ID</p>
                        <p className="text-sm font-medium text-gray-900">
                          {patient.id}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
