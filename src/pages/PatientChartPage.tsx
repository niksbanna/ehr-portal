import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  User,
  Calendar,
  Phone,
  Mail,
  Heart,
  AlertCircle,
  FileText,
  Activity,
  Pill,
  DollarSign,
} from 'lucide-react';
import { api } from '../services/api';
import Layout from '../components/layout/Layout';
import { SkeletonCard } from '../components/common/Skeleton';

const PatientChartPage = () => {
  const { patientId } = useParams<{ patientId: string }>();

  const { data: patient, isLoading: patientLoading } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => api.getPatient(patientId!),
    enabled: !!patientId,
  });

  const { data: encounters } = useQuery({
    queryKey: ['encounters'],
    queryFn: () => api.getEncounters(),
  });

  const { data: labResults } = useQuery({
    queryKey: ['labs'],
    queryFn: () => api.getLabResults(),
  });

  const { data: prescriptions } = useQuery({
    queryKey: ['prescriptions'],
    queryFn: () => api.getPrescriptions(),
  });

  const { data: bills } = useQuery({
    queryKey: ['bills'],
    queryFn: () => api.getBills(),
  });

  const patientEncounters = encounters?.filter((e) => e.patientId === patientId) || [];
  const patientLabs = labResults?.filter((l) => l.patientId === patientId) || [];
  const patientPrescriptions = prescriptions?.filter((p) => p.patientId === patientId) || [];
  const patientBills = bills?.filter((b) => b.patientId === patientId) || [];

  if (patientLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </Layout>
    );
  }

  if (!patient) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Patient not found</p>
        </div>
      </Layout>
    );
  }

  const calculateAge = (dob: string) => {
    const [day, month, year] = dob.split('-');
    const birthDate = new Date(`${year}-${month}-${day}`);
    const age = Math.floor((Date.now() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    return age;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Patient Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-full">
                <User className="text-blue-600 dark:text-blue-400" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {patient.firstName} {patient.lastName}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Patient ID: {patient.id}</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar size={16} />
                    {calculateAge(patient.dateOfBirth)} years old
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {patient.gender}
                  </span>
                  {patient.bloodGroup && (
                    <span className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <Heart size={16} />
                      {patient.bloodGroup}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demographics & Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Contact Information
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {patient.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {patient.email}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText size={18} className="text-gray-400 mt-1" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Address</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {patient.address}, {patient.city}, {patient.state} - {patient.pincode}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <AlertCircle size={18} className="text-orange-500 mt-1" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Emergency Contact</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {patient.emergencyContact}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {patient.emergencyPhone}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Medical Information
            </h2>
            <div className="space-y-3">
              {patient.allergies && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Allergies</p>
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">
                    {patient.allergies}
                  </p>
                </div>
              )}
              {patient.medicalHistory && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Medical History</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {patient.medicalHistory}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Registration Date</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {patient.registrationDate}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Encounters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
            <Activity size={20} className="text-gray-600 dark:text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Recent Encounters ({patientEncounters.length})
            </h2>
          </div>
          <div className="p-6">
            {patientEncounters.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No encounters recorded</p>
            ) : (
              <div className="space-y-4">
                {patientEncounters.slice(0, 5).map((encounter) => (
                  <div
                    key={encounter.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {encounter.chiefComplaint}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Diagnosis: {encounter.diagnosis}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          encounter.status === 'completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : encounter.status === 'in-progress'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}
                      >
                        {encounter.status}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {new Date(encounter.date).toLocaleDateString()} - Dr. {encounter.doctorName}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Lab Results */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
            <Activity size={20} className="text-gray-600 dark:text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Lab Results ({patientLabs.length})
            </h2>
          </div>
          <div className="p-6">
            {patientLabs.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No lab results available</p>
            ) : (
              <div className="space-y-3">
                {patientLabs.slice(0, 5).map((lab) => (
                  <div
                    key={lab.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {lab.testName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {lab.testCategory}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          lab.status === 'completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : lab.status === 'in-progress'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}
                      >
                        {lab.status}
                      </span>
                    </div>
                    {lab.results && (
                      <p className="mt-2 text-sm text-gray-900 dark:text-gray-100">
                        Results: {lab.results}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Prescriptions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
            <Pill size={20} className="text-gray-600 dark:text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Prescriptions ({patientPrescriptions.length})
            </h2>
          </div>
          <div className="p-6">
            {patientPrescriptions.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No prescriptions recorded</p>
            ) : (
              <div className="space-y-3">
                {patientPrescriptions.slice(0, 5).map((prescription) => (
                  <div
                    key={prescription.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(prescription.date).toLocaleDateString()} - Dr.{' '}
                          {prescription.doctorName}
                        </p>
                        <div className="mt-2 space-y-1">
                          {prescription.medications.map((med, idx) => (
                            <p
                              key={idx}
                              className="text-sm font-medium text-gray-900 dark:text-gray-100"
                            >
                              {med.name} - {med.dosage} ({med.frequency})
                            </p>
                          ))}
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          prescription.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}
                      >
                        {prescription.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Billing History */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
            <DollarSign size={20} className="text-gray-600 dark:text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Billing History ({patientBills.length})
            </h2>
          </div>
          <div className="p-6">
            {patientBills.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No billing records</p>
            ) : (
              <div className="space-y-3">
                {patientBills.slice(0, 5).map((bill) => (
                  <div
                    key={bill.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          Bill #{bill.id}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{bill.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-gray-100">
                          ₹{bill.total.toFixed(2)}
                        </p>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            bill.status === 'paid'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : bill.status === 'partially-paid'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}
                        >
                          {bill.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PatientChartPage;
