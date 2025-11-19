import { Patient } from '../types/index';

/**
 * Normalize string for comparison (lowercase, trim, remove extra spaces)
 */
function normalizeString(str: string): string {
  return str.toLowerCase().trim().replace(/\s+/g, ' ');
}

/**
 * Normalize phone number for comparison (remove all non-digits)
 */
function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

/**
 * Check if two patients are potential duplicates based on:
 * - Same name (first + last)
 * - Same date of birth
 * - Same mobile number
 *
 * @param patient1 First patient to compare
 * @param patient2 Second patient to compare
 * @returns true if patients are potential duplicates
 */
export function isPotentialDuplicate(patient1: Patient, patient2: Patient): boolean {
  // Normalize names
  const name1 = normalizeString(`${patient1.firstName} ${patient1.lastName}`);
  const name2 = normalizeString(`${patient2.firstName} ${patient2.lastName}`);

  // Normalize dates (convert to comparable format)
  const dob1 = patient1.dateOfBirth;
  const dob2 = patient2.dateOfBirth;

  // Normalize phones
  const phone1 = normalizePhone(patient1.phone);
  const phone2 = normalizePhone(patient2.phone);

  // Check if name matches
  const nameMatches = name1 === name2;

  // Check if DOB matches
  const dobMatches = dob1 === dob2;

  // Check if phone matches
  const phoneMatches = phone1 === phone2;

  // All three must match for duplicate
  return nameMatches && dobMatches && phoneMatches;
}

/**
 * Find potential duplicates of a patient in a list of patients
 *
 * @param patient Patient to check
 * @param patientList List of existing patients
 * @param excludeId Optional patient ID to exclude from comparison (for updates)
 * @returns Array of potential duplicate patients
 */
export function findDuplicatePatients(
  patient: Patient,
  patientList: Patient[],
  excludeId?: string
): Patient[] {
  return patientList.filter((existingPatient) => {
    // Skip if it's the same patient (when updating)
    if (excludeId && existingPatient.id === excludeId) {
      return false;
    }

    return isPotentialDuplicate(patient, existingPatient);
  });
}

/**
 * Check for partial matches that might indicate duplicates
 * Returns a confidence score (0-1) indicating likelihood of duplicate
 */
export function calculateDuplicateScore(patient1: Patient, patient2: Patient): number {
  let score = 0;
  let maxScore = 0;

  // Name similarity (weight: 3)
  maxScore += 3;
  const name1 = normalizeString(`${patient1.firstName} ${patient1.lastName}`);
  const name2 = normalizeString(`${patient2.firstName} ${patient2.lastName}`);
  if (name1 === name2) {
    score += 3;
  } else if (name1.includes(name2) || name2.includes(name1)) {
    score += 1.5;
  }

  // DOB match (weight: 3)
  maxScore += 3;
  if (patient1.dateOfBirth === patient2.dateOfBirth) {
    score += 3;
  }

  // Phone match (weight: 2)
  maxScore += 2;
  const phone1 = normalizePhone(patient1.phone);
  const phone2 = normalizePhone(patient2.phone);
  if (phone1 === phone2) {
    score += 2;
  } else if (phone1.slice(-10) === phone2.slice(-10)) {
    // Last 10 digits match
    score += 1.5;
  }

  // Email match (weight: 1)
  maxScore += 1;
  if (patient1.email.toLowerCase() === patient2.email.toLowerCase()) {
    score += 1;
  }

  // Address similarity (weight: 1)
  maxScore += 1;
  const addr1 = normalizeString(patient1.address);
  const addr2 = normalizeString(patient2.address);
  if (addr1 === addr2) {
    score += 1;
  } else if (addr1.includes(addr2) || addr2.includes(addr1)) {
    score += 0.5;
  }

  return score / maxScore;
}

/**
 * Find potential duplicates with confidence scores
 * Returns patients with confidence score >= threshold
 */
export function findPotentialDuplicatesWithScore(
  patient: Patient,
  patientList: Patient[],
  threshold: number = 0.7,
  excludeId?: string
): Array<{ patient: Patient; score: number }> {
  return patientList
    .filter((existingPatient) => {
      // Skip if it's the same patient (when updating)
      if (excludeId && existingPatient.id === excludeId) {
        return false;
      }
      return true;
    })
    .map((existingPatient) => ({
      patient: existingPatient,
      score: calculateDuplicateScore(patient, existingPatient),
    }))
    .filter((result) => result.score >= threshold)
    .sort((a, b) => b.score - a.score);
}
