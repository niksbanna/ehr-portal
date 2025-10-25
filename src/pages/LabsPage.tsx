import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import Layout from '../components/layout/Layout';
import { format } from 'date-fns';

const LabsPage = () => {
  const { data: labResults, isLoading } = useQuery({
    queryKey: ['labResults'],
    queryFn: () => api.getLabResults(),
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lab Results</h1>
          <p className="text-gray-600 mt-1">Laboratory test results</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Test Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ordered Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Results</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {labResults?.map((lab) => (
                  <tr key={lab.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {lab.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lab.patientName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {lab.testName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {lab.testCategory}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {format(new Date(lab.orderedDate), 'PPp')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          lab.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : lab.status === 'in-progress'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {lab.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {lab.status === 'completed' ? (
                        <div className="space-y-1">
                          <p className="font-medium">{lab.results}</p>
                          {lab.normalRange && (
                            <p className="text-xs text-gray-500">Normal: {lab.normalRange}</p>
                          )}
                          {lab.remarks && (
                            <p className="text-xs text-gray-500">{lab.remarks}</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">Pending</span>
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
