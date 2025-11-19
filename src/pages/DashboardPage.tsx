import { useQuery } from '@tanstack/react-query';
import { Users, Calendar, FlaskConical, DollarSign } from 'lucide-react';
import { api } from '../services/api';
import Layout from '../components/layout/Layout';
import { format } from 'date-fns';
import { formatINR } from '../schemas/fhir.schema';
import { useI18n } from '../hooks/useI18n';
import { SkeletonCard, SkeletonList } from '../components/common/Skeleton';

const DashboardPage = () => {
  const { t } = useI18n();
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.getDashboardStats(),
  });

  const statsCards = [
    {
      title: t('dashboard.totalPatients'),
      value: stats?.totalPatients || 0,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: t('dashboard.todayAppointments'),
      value: stats?.todayAppointments || 0,
      icon: Calendar,
      color: 'bg-green-500',
    },
    {
      title: t('dashboard.pendingLabs'),
      value: stats?.pendingLabs || 0,
      icon: FlaskConical,
      color: 'bg-yellow-500',
    },
    {
      title: t('dashboard.totalRevenue'),
      value: formatINR(stats?.totalRevenue || 0),
      icon: DollarSign,
      color: 'bg-purple-500',
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t('dashboard.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{t('dashboard.welcomeMessage')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            statsCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
                  role="region"
                  aria-label={card.title}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{card.title}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                        {card.value}
                      </p>
                    </div>
                    <div className={`${card.color} p-3 rounded-lg`}>
                      <Icon className="text-white" size={24} aria-hidden="true" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {t('dashboard.recentEncounters')}
              </h2>
            </div>
            <div className="p-6">
              {isLoading ? (
                <SkeletonList items={3} />
              ) : stats?.recentEncounters.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">
                  {t('dashboard.noRecentEncounters')}
                </p>
              ) : (
                <div className="space-y-4">
                  {stats?.recentEncounters.map((encounter) => (
                    <div
                      key={encounter.id}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {encounter.patientName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {encounter.chiefComplaint}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {format(new Date(encounter.date), 'PPp')}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          encounter.status === 'completed'
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'
                            : encounter.status === 'in-progress'
                              ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
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

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {t('dashboard.recentPatients')}
              </h2>
            </div>
            <div className="p-6">
              {isLoading ? (
                <SkeletonList items={3} />
              ) : stats?.recentPatients.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">
                  {t('dashboard.noRecentPatients')}
                </p>
              ) : (
                <div className="space-y-4">
                  {stats?.recentPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {patient.firstName} {patient.lastName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{patient.phone}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {patient.city}, {patient.state}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {t('dashboard.patientId')}
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
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
