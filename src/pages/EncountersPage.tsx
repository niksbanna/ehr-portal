import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import Layout from '../components/layout/Layout';
import { format } from 'date-fns';

const EncountersPage = () => {
  const { data: encounters, isLoading } = useQuery({
    queryKey: ['encounters'],
    queryFn: () => api.getEncounters(),
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Encounters</h1>
          <p className="text-gray-600 mt-1">Patient visit records</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : (
          <div className="grid gap-6">
            {encounters?.map((encounter) => (
              <div key={encounter.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {encounter.patientName}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Encounter ID: {encounter.id}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      encounter.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : encounter.status === 'in-progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : encounter.status === 'scheduled'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {encounter.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Date & Time</p>
                      <p className="font-medium">{format(new Date(encounter.date), 'PPp')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Type</p>
                      <p className="font-medium capitalize">{encounter.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Doctor</p>
                      <p className="font-medium">{encounter.doctorName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Chief Complaint</p>
                      <p className="font-medium">{encounter.chiefComplaint}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Diagnosis</p>
                      <p className="font-medium">{encounter.diagnosis}</p>
                    </div>
                  </div>

                  {encounter.vitalSigns && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Vital Signs</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {encounter.vitalSigns.temperature && (
                          <div>
                            <p className="text-gray-600">Temperature</p>
                            <p className="font-medium">{encounter.vitalSigns.temperature}°F</p>
                          </div>
                        )}
                        {encounter.vitalSigns.bloodPressure && (
                          <div>
                            <p className="text-gray-600">BP</p>
                            <p className="font-medium">{encounter.vitalSigns.bloodPressure}</p>
                          </div>
                        )}
                        {encounter.vitalSigns.heartRate && (
                          <div>
                            <p className="text-gray-600">Heart Rate</p>
                            <p className="font-medium">{encounter.vitalSigns.heartRate} bpm</p>
                          </div>
                        )}
                        {encounter.vitalSigns.spo2 && (
                          <div>
                            <p className="text-gray-600">SpO2</p>
                            <p className="font-medium">{encounter.vitalSigns.spo2}%</p>
                          </div>
                        )}
                        {encounter.vitalSigns.weight && (
                          <div>
                            <p className="text-gray-600">Weight</p>
                            <p className="font-medium">{encounter.vitalSigns.weight} kg</p>
                          </div>
                        )}
                        {encounter.vitalSigns.height && (
                          <div>
                            <p className="text-gray-600">Height</p>
                            <p className="font-medium">{encounter.vitalSigns.height} cm</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {encounter.notes && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600">Notes</p>
                    <p className="mt-1">{encounter.notes}</p>
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

export default EncountersPage;
