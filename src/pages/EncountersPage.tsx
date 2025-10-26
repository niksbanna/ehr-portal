import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import Layout from '../components/layout/Layout';
import { format } from 'date-fns';
import { Plus, WifiOff, Upload } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';
import { Encounter } from '../types';
import { sanitizeRichText } from '../utils/sanitize';
import { useAuth } from '../hooks/useAuth';
import { logAuditEvent } from '../services/auditLogger';

const EncountersPage = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    type: 'consultation' as const,
    chiefComplaint: '',
    soapNotes: {
      subjective: '',
      objective: '',
      assessment: '',
      plan: '',
    },
    vitalSigns: {
      temperature: '',
      bloodPressure: '',
      heartRate: '',
      spo2: '',
      weight: '',
      height: '',
    },
  });

  // Monitor online/offline status
  useState(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  });

  const { data: encounters, isLoading } = useQuery({
    queryKey: ['encounters'],
    queryFn: () => api.getEncounters(),
  });

  const { data: patients } = useQuery({
    queryKey: ['patients'],
    queryFn: () => api.getPatients(),
  });

  const createEncounterMutation = useMutation({
    mutationFn: async (encounterData: Partial<Encounter>) => {
      // Sanitize SOAP notes before saving
      if (encounterData.soapNotes) {
        encounterData.soapNotes = {
          subjective: sanitizeRichText(encounterData.soapNotes.subjective || ''),
          objective: sanitizeRichText(encounterData.soapNotes.objective || ''),
          assessment: sanitizeRichText(encounterData.soapNotes.assessment || ''),
          plan: sanitizeRichText(encounterData.soapNotes.plan || ''),
        };
      }

      // Sanitize notes
      if (encounterData.notes) {
        encounterData.notes = sanitizeRichText(encounterData.notes);
      }

      if (!isOnline) {
        // Store in offline queue
        const queue = JSON.parse(localStorage.getItem('syncQueue') || '[]');
        const queueItem = {
          id: `temp-${Date.now()}`,
          type: 'encounter',
          action: 'create',
          data: encounterData,
          timestamp: new Date().toISOString(),
          synced: false,
        };
        queue.push(queueItem);
        localStorage.setItem('syncQueue', JSON.stringify(queue));
        return queueItem;
      }
      return api.createEncounter(encounterData);
    },
    onSuccess: (newEncounter: Encounter | { id: string; patientName: string }) => {
      queryClient.invalidateQueries({ queryKey: ['encounters'] });
      setShowForm(false);
      resetForm();

      // Log audit event
      if (user && newEncounter?.id) {
        logAuditEvent({
          userId: user.id,
          userName: user.name,
          userRole: user.role,
          action: 'Created',
          resource: 'Encounter',
          resourceId: newEncounter.id,
          details: `Created encounter for patient ${newEncounter.patientName}`,
        });
      }
    },
  });

  const resetForm = () => {
    setFormData({
      patientId: '',
      patientName: '',
      type: 'consultation',
      chiefComplaint: '',
      soapNotes: {
        subjective: '',
        objective: '',
        assessment: '',
        plan: '',
      },
      vitalSigns: {
        temperature: '',
        bloodPressure: '',
        heartRate: '',
        spo2: '',
        weight: '',
        height: '',
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const encounterData = {
      ...formData,
      diagnosis: formData.soapNotes.assessment,
      notes: `Subjective: ${formData.soapNotes.subjective}\nObjective: ${formData.soapNotes.objective}\nAssessment: ${formData.soapNotes.assessment}\nPlan: ${formData.soapNotes.plan}`,
      vitalSigns: {
        temperature: formData.vitalSigns.temperature
          ? parseFloat(formData.vitalSigns.temperature)
          : undefined,
        bloodPressure: formData.vitalSigns.bloodPressure || undefined,
        heartRate: formData.vitalSigns.heartRate
          ? parseInt(formData.vitalSigns.heartRate)
          : undefined,
        spo2: formData.vitalSigns.spo2 ? parseInt(formData.vitalSigns.spo2) : undefined,
        weight: formData.vitalSigns.weight ? parseFloat(formData.vitalSigns.weight) : undefined,
        height: formData.vitalSigns.height ? parseFloat(formData.vitalSigns.height) : undefined,
      },
    };
    createEncounterMutation.mutate(encounterData);
  };

  const syncOfflineData = async () => {
    const queue = JSON.parse(localStorage.getItem('syncQueue') || '[]');
    const pendingItems = queue.filter((item: { synced: boolean }) => !item.synced);

    for (const item of pendingItems) {
      try {
        if (item.type === 'encounter' && item.action === 'create') {
          await api.createEncounter(item.data);
          item.synced = true;
        }
      } catch (error) {
        console.error('Sync failed for item:', item, error);
      }
    }

    localStorage.setItem('syncQueue', JSON.stringify(queue));
    queryClient.invalidateQueries({ queryKey: ['encounters'] });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {t('encounters.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Patient visit records with SOAP notes
            </p>
          </div>
          <div className="flex gap-3">
            {!isOnline && (
              <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-4 py-2 rounded-lg">
                <WifiOff size={20} />
                <span className="text-sm font-medium">Offline Mode</span>
              </div>
            )}
            {!isOnline &&
              JSON.parse(localStorage.getItem('syncQueue') || '[]').some(
                (item: { synced: boolean }) => !item.synced
              ) &&
              isOnline && (
                <button
                  onClick={syncOfflineData}
                  className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Upload size={20} />
                  Sync Offline Data
                </button>
              )}
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              {t('encounters.addEncounter')}
            </button>
          </div>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              New Encounter - SOAP Notes
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Patient
                </label>
                <select
                  required
                  value={formData.patientId}
                  onChange={(e) => {
                    const patient = patients?.find((p) => p.id === e.target.value);
                    setFormData({
                      ...formData,
                      patientId: e.target.value,
                      patientName: patient ? `${patient.firstName} ${patient.lastName}` : '',
                    });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="">Select Patient</option>
                  {patients?.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName} ({patient.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as 'consultation' | 'followup' | 'emergency',
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="consultation">Consultation</option>
                  <option value="followup">Follow-up</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Chief Complaint
              </label>
              <input
                type="text"
                required
                value={formData.chiefComplaint}
                onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            {/* Vital Signs */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Vital Signs
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Temperature (°F)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.vitalSigns.temperature}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vitalSigns: { ...formData.vitalSigns, temperature: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Blood Pressure
                  </label>
                  <input
                    type="text"
                    placeholder="120/80"
                    value={formData.vitalSigns.bloodPressure}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vitalSigns: { ...formData.vitalSigns, bloodPressure: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Heart Rate (bpm)
                  </label>
                  <input
                    type="number"
                    value={formData.vitalSigns.heartRate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vitalSigns: { ...formData.vitalSigns, heartRate: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    SpO2 (%)
                  </label>
                  <input
                    type="number"
                    value={formData.vitalSigns.spo2}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vitalSigns: { ...formData.vitalSigns, spo2: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.vitalSigns.weight}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vitalSigns: { ...formData.vitalSigns, weight: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.vitalSigns.height}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vitalSigns: { ...formData.vitalSigns, height: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* SOAP Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">SOAP Notes</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subjective (Patient's complaint and history)
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.soapNotes.subjective}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      soapNotes: { ...formData.soapNotes, subjective: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  placeholder="What the patient tells you about their symptoms..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Objective (Physical examination findings)
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.soapNotes.objective}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      soapNotes: { ...formData.soapNotes, objective: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Physical examination findings, test results..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assessment (Diagnosis)
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.soapNotes.assessment}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      soapNotes: { ...formData.soapNotes, assessment: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Your diagnosis based on S and O..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Plan (Treatment plan)
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.soapNotes.plan}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      soapNotes: { ...formData.soapNotes, plan: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Treatment plan, medications, follow-up..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isOnline ? 'Create Encounter' : 'Save Offline'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-gray-100 py-2 px-6 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500 dark:text-gray-400">Loading...</div>
          </div>
        ) : (
          <div className="grid gap-6">
            {encounters?.map((encounter) => (
              <div key={encounter.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {encounter.patientName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Encounter ID: {encounter.id}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      encounter.status === 'completed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : encounter.status === 'in-progress'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : encounter.status === 'scheduled'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}
                  >
                    {encounter.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Date & Time</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {format(new Date(encounter.date), 'PPp')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                        {encounter.type}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Doctor</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {encounter.doctorName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Chief Complaint</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {encounter.chiefComplaint}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Diagnosis</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {encounter.diagnosis}
                      </p>
                    </div>
                  </div>

                  {encounter.vitalSigns && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                        Vital Signs
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {encounter.vitalSigns.temperature && (
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Temperature</p>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {encounter.vitalSigns.temperature}°F
                            </p>
                          </div>
                        )}
                        {encounter.vitalSigns.bloodPressure && (
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">BP</p>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {encounter.vitalSigns.bloodPressure}
                            </p>
                          </div>
                        )}
                        {encounter.vitalSigns.heartRate && (
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Heart Rate</p>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {encounter.vitalSigns.heartRate} bpm
                            </p>
                          </div>
                        )}
                        {encounter.vitalSigns.spo2 && (
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">SpO2</p>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {encounter.vitalSigns.spo2}%
                            </p>
                          </div>
                        )}
                        {encounter.vitalSigns.weight && (
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Weight</p>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {encounter.vitalSigns.weight} kg
                            </p>
                          </div>
                        )}
                        {encounter.vitalSigns.height && (
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Height</p>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {encounter.vitalSigns.height} cm
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {encounter.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Notes</p>
                    <p className="mt-1 text-gray-900 dark:text-gray-100 whitespace-pre-line">
                      {encounter.notes}
                    </p>
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
