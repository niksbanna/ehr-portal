import { z } from 'zod';
import { indianMobileRegex, pincodeRegex, ddMMyyyyRegex, aadhaarRegex } from './fhir.schema';

/**
 * Patient Form Schema - Simplified for UI forms with Zod validation
 * This bridges the existing simple form structure with FHIR validation
 */
export const PatientFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  dateOfBirth: z
    .string()
    .regex(ddMMyyyyRegex, 'Date must be in DD-MM-YYYY format')
    .refine((date) => {
      const [day, month, year] = date.split('-').map(Number);
      const birthDate = new Date(year, month - 1, day);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 0 && age <= 150;
    }, 'Invalid date of birth'),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Gender is required',
  }),
  phone: z
    .string()
    .regex(
      indianMobileRegex,
      'Invalid Indian mobile number (format: +91XXXXXXXXXX or 10 digits starting with 6-9)'
    )
    .transform((val) => {
      // Normalize to +91 format
      const cleaned = val.replace(/\D/g, '');
      if (cleaned.length === 10) {
        return `+91${cleaned}`;
      } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
        return `+${cleaned}`;
      }
      return val;
    }),
  email: z.string().email('Invalid email address'),
  aadhaar: z
    .string()
    .regex(aadhaarRegex, 'Invalid Aadhaar number (must be 12 digits)')
    .optional()
    .or(z.literal('')),
  address: z.string().min(1, 'Address is required').max(200, 'Address too long'),
  city: z.string().min(1, 'City is required').max(50, 'City name too long'),
  state: z.string().min(1, 'State is required').max(50, 'State name too long'),
  pincode: z.string().regex(pincodeRegex, 'Invalid pincode (must be 6 digits)'),
  emergencyContact: z.string().min(1, 'Emergency contact name is required'),
  emergencyPhone: z.string().regex(indianMobileRegex, 'Invalid Indian mobile number'),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', '']).optional(),
  allergies: z.string().max(500, 'Allergies description too long').optional(),
  medicalHistory: z.string().max(1000, 'Medical history too long').optional(),
});

export type PatientFormData = z.infer<typeof PatientFormSchema>;

/**
 * Encounter Form Schema
 */
export const EncounterFormSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  doctorId: z.string().min(1, 'Doctor is required'),
  type: z.enum(['consultation', 'followup', 'emergency'], {
    required_error: 'Encounter type is required',
  }),
  chiefComplaint: z.string().min(1, 'Chief complaint is required'),
  diagnosisCode: z
    .string()
    .regex(/^[A-Z]\d{2}(\.[0-9A-Z]{1,4})?$/, 'Invalid ICD-10 code format (e.g., J06.9, E11.9)')
    .optional()
    .or(z.literal('')),
  diagnosisDescription: z.string().min(1, 'Diagnosis description is required'),
  notes: z.string().optional(),
  // Vital signs (optional)
  temperature: z.number().min(90).max(115).optional().or(z.nan()),
  bloodPressure: z
    .string()
    .regex(/^\d{2,3}\/\d{2,3}$/, 'Invalid blood pressure format (e.g., 120/80)')
    .optional()
    .or(z.literal('')),
  heartRate: z.number().min(30).max(250).optional().or(z.nan()),
  respiratoryRate: z.number().min(5).max(60).optional().or(z.nan()),
  spo2: z.number().min(50).max(100).optional().or(z.nan()),
  weight: z.number().min(0.5).max(500).optional().or(z.nan()),
  height: z.number().min(30).max(300).optional().or(z.nan()),
});

export type EncounterFormData = z.infer<typeof EncounterFormSchema>;

/**
 * Medication Form Schema
 */
export const MedicationFormSchema = z.object({
  name: z.string().min(1, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  duration: z.string().min(1, 'Duration is required'),
  route: z.enum(['Oral', 'IV', 'IM', 'SC', 'Topical', 'Inhalation', 'Rectal', 'Other']),
  instructions: z.string().max(500).optional(),
});

export type MedicationFormData = z.infer<typeof MedicationFormSchema>;

/**
 * Billing Item Schema
 */
export const BillItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0, 'Unit price must be non-negative'),
});

/**
 * Billing Form Schema (INR currency enforced)
 */
export const BillingFormSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  encounterId: z.string().optional(),
  items: z.array(BillItemSchema).min(1, 'At least one item is required'),
  discount: z.number().min(0, 'Discount must be non-negative').default(0),
  paymentMethod: z.enum(['Cash', 'Card', 'UPI', 'Net Banking', 'Insurance', 'Other']).optional(),
});

export type BillingFormData = z.infer<typeof BillingFormSchema>;

/**
 * ICD-10 Common Diagnosis Codes for Indian Hospitals
 */
export const ICD10_COMMON_CODES = [
  { code: 'J06.9', description: 'Acute upper respiratory infection, unspecified' },
  { code: 'A09', description: 'Diarrhoea and gastroenteritis' },
  { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
  { code: 'I10', description: 'Essential (primary) hypertension' },
  { code: 'J18.9', description: 'Pneumonia, unspecified organism' },
  { code: 'R50.9', description: 'Fever, unspecified' },
  { code: 'K29.7', description: 'Gastritis, unspecified' },
  { code: 'M79.3', description: 'Panniculitis, unspecified' },
  { code: 'R51', description: 'Headache' },
  { code: 'R10.4', description: 'Other and unspecified abdominal pain' },
  { code: 'J00', description: 'Acute nasopharyngitis (common cold)' },
  { code: 'J03.9', description: 'Acute tonsillitis, unspecified' },
  { code: 'A09.0', description: 'Other gastroenteritis and colitis' },
  { code: 'R11', description: 'Nausea and vomiting' },
  { code: 'M25.5', description: 'Pain in joint' },
  { code: 'I25.1', description: 'Atherosclerotic heart disease' },
  { code: 'E78.5', description: 'Hyperlipidaemia, unspecified' },
  { code: 'N39.0', description: 'Urinary tract infection' },
  { code: 'L30.9', description: 'Dermatitis, unspecified' },
  { code: 'H10.9', description: 'Conjunctivitis, unspecified' },
] as const;
