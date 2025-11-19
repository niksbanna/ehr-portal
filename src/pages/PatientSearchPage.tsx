import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, User } from 'lucide-react';
import { api } from '../services/api';
import Layout from '../components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import { Patient } from '../types';

const PatientSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { data: patients, isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: () => api.getPatients(),
  });

  const filteredPatients =
    patients?.filter((patient: Patient) => {
      const query = searchQuery.toLowerCase();
      return (
        patient.firstName.toLowerCase().includes(query) ||
        patient.lastName.toLowerCase().includes(query) ||
        patient.email.toLowerCase().includes(query) ||
        patient.phone.includes(query) ||
        patient.id.toLowerCase().includes(query)
      );
    }) || [];

  const handlePatientClick = (patientId: string) => {
    navigate(`/patients/${patientId}`);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Patient Search</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Search for patients by name, ID, phone, or email
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, ID, phone, or email..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Search Results ({filteredPatients.length})
            </h2>
          </div>

          {isLoading ? (
            <div className="p-6">
              <p className="text-gray-500 dark:text-gray-400">Loading patients...</p>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="p-6 text-center">
              <User className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-500 dark:text-gray-400">
                {searchQuery
                  ? 'No patients found matching your search'
                  : 'Enter a search query to find patients'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPatients.map((patient: Patient) => (
                <div
                  key={patient.id}
                  onClick={() => handlePatientClick(patient.id)}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                          <User className="text-blue-600 dark:text-blue-400" size={20} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {patient.firstName} {patient.lastName}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            ID: {patient.id}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Age</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {(() => {
                              const [day, month, year] = patient.dateOfBirth.split('-');
                              const dob = new Date(`${year}-${month}-${day}`);
                              const age = Math.floor(
                                (Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
                              );
                              return age;
                            })()}
                            {' years'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Gender</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                            {patient.gender}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {patient.phone}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Blood Group</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {patient.bloodGroup || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PatientSearchPage;
