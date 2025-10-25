import { X } from 'lucide-react';
import { Patient } from '../../types';
import { useI18n } from '../../contexts/I18nContext';

interface PatientHeaderProps {
  patient: Patient;
  onClose: () => void;
}

const PatientHeader = ({ patient, onClose }: PatientHeaderProps) => {
  const { t } = useI18n();

  return (
    <div 
      className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 px-6 py-3"
      role="banner"
      aria-label="Active patient information"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('dashboard.patientId')}:
              </span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {patient.id}
              </span>
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {patient.firstName} {patient.lastName}
            </h2>
          </div>
          <div className="flex space-x-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">
                {t('patients.dateOfBirth')}:
              </span>
              <span className="ml-1 text-gray-900 dark:text-gray-100">
                {patient.dateOfBirth}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">
                {t('patients.phone')}:
              </span>
              <span className="ml-1 text-gray-900 dark:text-gray-100">
                {patient.phone}
              </span>
            </div>
            {patient.bloodGroup && (
              <div>
                <span className="text-gray-600 dark:text-gray-400">
                  {t('patients.bloodGroup')}:
                </span>
                <span className="ml-1 text-gray-900 dark:text-gray-100">
                  {patient.bloodGroup}
                </span>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-lg transition-colors"
          aria-label="Close patient header"
        >
          <X size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default PatientHeader;
