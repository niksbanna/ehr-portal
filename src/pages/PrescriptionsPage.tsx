import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import Layout from '../components/layout/Layout';
import { format } from 'date-fns';

const PrescriptionsPage = () => {
  const { data: prescriptions, isLoading } = useQuery({
    queryKey: ['prescriptions'],
    queryFn: () => api.getPrescriptions(),
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Prescriptions</h1>
          <p className="text-gray-600 mt-1">Medication prescriptions</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : (
          <div className="grid gap-6">
            {prescriptions?.map((prescription) => (
              <div key={prescription.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Prescription {prescription.id}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Patient: {prescription.patientName}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      prescription.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : prescription.status === 'completed'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {prescription.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium">{format(new Date(prescription.date), 'PPp')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Doctor</p>
                    <p className="font-medium">{prescription.doctorName}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Medications</h4>
                  <div className="space-y-3">
                    {prescription.medications.map((med, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-gray-900">{med.name}</h5>
                          <span className="text-sm text-gray-600">{med.dosage}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Frequency</p>
                            <p className="font-medium">{med.frequency}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Duration</p>
                            <p className="font-medium">{med.duration}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Route</p>
                            <p className="font-medium">{med.route}</p>
                          </div>
                        </div>
                        {med.instructions && (
                          <p className="mt-2 text-sm text-gray-600">
                            <span className="font-medium">Instructions:</span> {med.instructions}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {prescription.instructions && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-1">General Instructions</p>
                    <p className="text-gray-900">{prescription.instructions}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PrescriptionsPage;
