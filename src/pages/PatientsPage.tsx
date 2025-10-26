import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Edit, Trash2, X, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';
import Layout from '../components/layout/Layout';
import { Patient } from '../types/index';
import { PatientFormSchema, PatientFormData } from '../schemas/patient-form.schema';
import { maskAadhaar, formatIndianMobile } from '../schemas/fhir.schema';
import { findDuplicatePatients } from '../utils/duplicate-detection';
import { useAuth } from '../hooks/useAuth';
import { logAuditEvent } from '../services/auditLogger';

const PatientsPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<Patient[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<PatientFormData>({
    resolver: zodResolver(PatientFormSchema),
  });

  const { data: patients, isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: () => api.getPatients(),
  });

  const createMutation = useMutation({
    mutationFn: (data: PatientFormData) =>
      api.createPatient(data as Omit<Patient, 'id' | 'registrationDate'>),
    onSuccess: (newPatient) => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      setShowModal(false);
      setDuplicateWarning([]);
      reset();

      // Log audit event
      if (user) {
        logAuditEvent({
          userId: user.id,
          userName: user.name,
          userRole: user.role,
          action: 'Created',
          resource: 'Patient',
          resourceId: newPatient.id,
          details: `Created patient record for ${newPatient.firstName} ${newPatient.lastName}`,
        });
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: Partial<Patient> & { id: string }) => api.updatePatient(id, data),
    onSuccess: (updatedPatient) => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      setShowModal(false);
      setEditingPatient(null);
      setDuplicateWarning([]);
      reset();

      // Log audit event
      if (user) {
        logAuditEvent({
          userId: user.id,
          userName: user.name,
          userRole: user.role,
          action: 'Updated',
          resource: 'Patient',
          resourceId: updatedPatient.id,
          details: `Updated patient record for ${updatedPatient.firstName} ${updatedPatient.lastName}`,
        });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deletePatient(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });

      // Log audit event
      if (user) {
        const deletedPatient = patients?.find((p) => p.id === deletedId);
        logAuditEvent({
          userId: user.id,
          userName: user.name,
          userRole: user.role,
          action: 'Deleted',
          resource: 'Patient',
          resourceId: deletedId,
          details: deletedPatient
            ? `Deleted patient record for ${deletedPatient.firstName} ${deletedPatient.lastName}`
            : `Deleted patient record ${deletedId}`,
        });
      }
    },
  });

  const onSubmit = (data: PatientFormData) => {
    // Check for duplicates before saving
    const patientToCheck: Patient = {
      ...data,
      id: editingPatient?.id || '',
      registrationDate: editingPatient?.registrationDate || '',
    };

    const duplicates = findDuplicatePatients(patientToCheck, patients || [], editingPatient?.id);

    if (duplicates.length > 0 && !duplicateWarning.length) {
      setDuplicateWarning(duplicates);
      return;
    }

    if (editingPatient) {
      updateMutation.mutate({ ...data, id: editingPatient.id } as Partial<Patient> & {
        id: string;
      });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    reset(patient);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPatient(null);
    setDuplicateWarning([]);
    reset();
  };

  const handleForceSave = () => {
    const data = watch();
    if (editingPatient) {
      updateMutation.mutate({ ...data, id: editingPatient.id } as Partial<Patient> & {
        id: string;
      });
    } else {
      createMutation.mutate(data as PatientFormData);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
            <p className="text-gray-600 mt-1">Manage patient registry</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Add new patient"
          >
            <Plus size={20} aria-hidden="true" />
            Add Patient
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table
              className="min-w-full divide-y divide-gray-200"
              role="table"
              aria-label="Patient registry table"
            >
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    scope="col"
                  >
                    ID
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    scope="col"
                  >
                    Name
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    scope="col"
                  >
                    Gender
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    scope="col"
                  >
                    DOB
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    scope="col"
                  >
                    Phone
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    scope="col"
                  >
                    Aadhaar
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    scope="col"
                  >
                    City
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                    scope="col"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patients?.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {patient.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {patient.firstName} {patient.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                      {patient.gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {patient.dateOfBirth}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatIndianMobile(patient.phone)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                      {patient.aadhaar ? maskAadhaar(patient.aadhaar) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {patient.city}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(patient)}
                          className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded p-1"
                          aria-label={`Edit patient ${patient.firstName} ${patient.lastName}`}
                        >
                          <Edit size={18} aria-hidden="true" />
                        </button>
                        <button
                          onClick={() => handleDelete(patient.id)}
                          className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 rounded p-1"
                          aria-label={`Delete patient ${patient.firstName} ${patient.lastName}`}
                        >
                          <Trash2 size={18} aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="patient-modal-title"
          >
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 id="patient-modal-title" className="text-xl font-semibold">
                  {editingPatient ? 'Edit Patient' : 'Add New Patient'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded p-1"
                  aria-label="Close modal"
                >
                  <X size={24} aria-hidden="true" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                {duplicateWarning.length > 0 && (
                  <div
                    className="bg-yellow-50 border border-yellow-400 rounded-lg p-4"
                    role="alert"
                    aria-live="polite"
                  >
                    <div className="flex items-start gap-2">
                      <AlertTriangle
                        className="text-yellow-600 mt-0.5"
                        size={20}
                        aria-hidden="true"
                      />
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-yellow-800 mb-1">
                          Potential Duplicate Patient Detected
                        </h3>
                        <p className="text-sm text-yellow-700 mb-2">
                          A patient with the same name, date of birth, and phone number already
                          exists:
                        </p>
                        <ul className="text-sm text-yellow-700 space-y-1">
                          {duplicateWarning.map((dup) => (
                            <li key={dup.id} className="font-medium">
                              {dup.id} - {dup.firstName} {dup.lastName} ({dup.dateOfBirth})
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 flex gap-2">
                          <button
                            type="button"
                            onClick={handleForceSave}
                            className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                          >
                            Save Anyway
                          </button>
                          <button
                            type="button"
                            onClick={() => setDuplicateWarning([])}
                            className="px-3 py-1 bg-white border border-yellow-600 text-yellow-700 rounded text-sm hover:bg-yellow-50"
                          >
                            Review & Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      {...register('firstName')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-600 mt-1">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      {...register('lastName')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-600 mt-1">{errors.lastName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth (DD-MM-YYYY) *
                    </label>
                    <input
                      type="text"
                      placeholder="DD-MM-YYYY"
                      {...register('dateOfBirth')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.dateOfBirth && (
                      <p className="text-sm text-red-600 mt-1">{errors.dateOfBirth.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                    <select
                      {...register('gender')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && (
                      <p className="text-sm text-red-600 mt-1">{errors.gender.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone (+91 format) *
                    </label>
                    <input
                      type="tel"
                      placeholder="+919876543210 or 9876543210"
                      {...register('phone')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      {...register('email')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Aadhaar Number (12 digits)
                    </label>
                    <input
                      type="text"
                      placeholder="123456789012"
                      maxLength={12}
                      {...register('aadhaar')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                    {errors.aadhaar && (
                      <p className="text-sm text-red-600 mt-1">{errors.aadhaar.message}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Will be masked as XXXX-XXXX-XXXX</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                  <input
                    {...register('address')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.address && (
                    <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input
                      {...register('city')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.city && (
                      <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                    <input
                      {...register('state')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.state && (
                      <p className="text-sm text-red-600 mt-1">{errors.state.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pincode (6 digits) *
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="400001"
                      {...register('pincode')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.pincode && (
                      <p className="text-sm text-red-600 mt-1">{errors.pincode.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Emergency Contact *
                    </label>
                    <input
                      {...register('emergencyContact')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.emergencyContact && (
                      <p className="text-sm text-red-600 mt-1">{errors.emergencyContact.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Emergency Phone *
                    </label>
                    <input
                      type="tel"
                      placeholder="+919876543210"
                      {...register('emergencyPhone')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.emergencyPhone && (
                      <p className="text-sm text-red-600 mt-1">{errors.emergencyPhone.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Blood Group
                    </label>
                    <select
                      {...register('bloodGroup')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Allergies
                    </label>
                    <input
                      {...register('allergies')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medical History
                  </label>
                  <textarea
                    {...register('medicalHistory')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingPatient ? 'Update' : 'Create'} Patient
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PatientsPage;
