import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import Layout from '../components/layout/Layout';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

// Mock trending data for demonstration
const mockTrendData = {
  'Fasting Blood Sugar': [
    { date: '2024-09-25', value: 105 },
    { date: '2024-10-05', value: 108 },
    { date: '2024-10-15', value: 112 },
    { date: '2024-10-25', value: 110 },
  ],
  HbA1c: [
    { date: '2024-07-25', value: 7.2 },
    { date: '2024-08-25', value: 6.9 },
    { date: '2024-09-25', value: 6.7 },
    { date: '2024-10-25', value: 6.5 },
  ],
};

const LabsPage = () => {
  const [selectedTrend, setSelectedTrend] = useState<string | null>(null);

  const { data: labResults, isLoading } = useQuery({
    queryKey: ['labResults'],
    queryFn: () => api.getLabResults(),
  });

  const getTestsWithTrends = () => {
    return ['Fasting Blood Sugar', 'HbA1c'];
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Lab Results</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Laboratory test results and trends
          </p>
        </div>

        {/* Trend Visualization */}
        {selectedTrend && mockTrendData[selectedTrend as keyof typeof mockTrendData] && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-blue-600 dark:text-blue-400" size={24} />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {selectedTrend} Trend
                </h2>
              </div>
              <button
                onClick={() => setSelectedTrend(null)}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                Close
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockTrendData[selectedTrend as keyof typeof mockTrendData]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(date) => format(new Date(date), 'MMM dd')} />
                <YAxis />
                <Tooltip
                  labelFormatter={(date) => format(new Date(date), 'PPP')}
                  formatter={(value: number) => [value, selectedTrend]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ fill: '#2563eb', r: 4 }}
                  activeDot={{ r: 6 }}
                  name={selectedTrend}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500 dark:text-gray-400">Loading...</div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Test Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Ordered Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Results
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {labResults?.map((lab) => (
                  <tr key={lab.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {lab.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {lab.patientName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                      {lab.testName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {lab.testCategory}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {format(new Date(lab.orderedDate), 'PPp')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          lab.status === 'completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : lab.status === 'in-progress'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}
                      >
                        {lab.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {lab.status === 'completed' ? (
                        <div className="space-y-1">
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {lab.results}
                          </p>
                          {lab.normalRange && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Normal: {lab.normalRange}
                            </p>
                          )}
                          {lab.remarks && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {lab.remarks}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {getTestsWithTrends().includes(lab.testName) && (
                        <button
                          onClick={() => setSelectedTrend(lab.testName)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1"
                        >
                          <TrendingUp size={16} />
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LabsPage;
