import { z } from 'zod';

// Utility validation functions for Indian context

// Validate Indian mobile number (+91 format)
export const indianMobileRegex = /^(\+91|91)?[6-9]\d{9}$/;

// Validate Aadhaar number (12 digits)
export const aadhaarRegex = /^\d{12}$/;

// Validate Indian pincode (6 digits)
export const pincodeRegex = /^\d{6}$/;

// DD-MM-YYYY date format regex
export const ddMMyyyyRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

// ICD-10 code format (alphanumeric, 3-7 characters)
export const icd10Regex = /^[A-Z]\d{2}(\.[0-9A-Z]{1,4})?$/;

// Utility functions

/**
 * Mask Aadhaar number to show only last 4 digits
 * Example: 123456789012 -> XXXX-XXXX-9012
 */
export function maskAadhaar(aadhaar: string): string {
  if (!aadhaar || aadhaar.length !== 12) return aadhaar;
  return `XXXX-XXXX-${aadhaar.slice(-4)}`;
}

/**
 * Format mobile number to +91 format
 */
export function formatIndianMobile(mobile: string): string {
  const cleaned = mobile.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }
  return mobile;
}

/**
 * Convert ISO date to DD-MM-YYYY format
 */
export function formatToDDMMYYYY(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

/**
 * Convert DD-MM-YYYY to ISO date format
 */
export function parseDDMMYYYY(dateStr: string): Date {
  const [day, month, year] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Format currency in INR
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}

// FHIR-like Schema Definitions with Zod

// HumanName (FHIR)
export const HumanNameSchema = z.object({
  use: z.enum(['official', 'usual', 'temp', 'nickname', 'anonymous', 'old', 'maiden']).optional(),
  text: z.string().optional(),
  family: z.string().min(1, 'Family name is required'),
  given: z.array(z.string()).min(1, 'At least one given name is required'),
  prefix: z.array(z.string()).optional(),
  suffix: z.array(z.string()).optional(),
});

// ContactPoint (FHIR)
export const ContactPointSchema = z.object({
  system: z.enum(['phone', 'fax', 'email', 'pager', 'url', 'sms', 'other']),
  value: z.string(),
  use: z.enum(['home', 'work', 'temp', 'old', 'mobile']).optional(),
  rank: z.number().optional(),
});

// Address (FHIR)
export const AddressSchema = z.object({
  use: z.enum(['home', 'work', 'temp', 'old', 'billing']).optional(),
  type: z.enum(['postal', 'physical', 'both']).optional(),
  text: z.string().optional(),
  line: z.array(z.string()),
  city: z.string().min(1, 'City is required'),
  district: z.string().optional(),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().regex(pincodeRegex, 'Invalid pincode (must be 6 digits)'),
  country: z.string().default('IN'),
});

// Identifier (FHIR)
export const IdentifierSchema = z.object({
  use: z.enum(['usual', 'official', 'temp', 'secondary', 'old']).optional(),
  type: z.object({
    coding: z.array(z.object({
      system: z.string(),
      code: z.string(),
      display: z.string().optional(),
    })),
    text: z.string().optional(),
  }).optional(),
  system: z.string(),
  value: z.string(),
  period: z.object({
    start: z.string().optional(),
    end: z.string().optional(),
  }).optional(),
});

// CodeableConcept (FHIR)
export const CodeableConceptSchema = z.object({
  coding: z.array(z.object({
    system: z.string(),
    version: z.string().optional(),
    code: z.string(),
    display: z.string().optional(),
    userSelected: z.boolean().optional(),
  })),
  text: z.string().optional(),
});

// Patient Schema (FHIR-like with Indian context)
export const PatientSchema = z.object({
  resourceType: z.literal('Patient').default('Patient'),
  id: z.string().optional(),
  identifier: z.array(IdentifierSchema).optional(),
  active: z.boolean().default(true),
  name: z.array(HumanNameSchema).min(1, 'At least one name is required'),
  telecom: z.array(ContactPointSchema).optional(),
  gender: z.enum(['male', 'female', 'other', 'unknown']),
  birthDate: z.string().regex(ddMMyyyyRegex, 'Date must be in DD-MM-YYYY format'),
  address: z.array(AddressSchema).optional(),
  maritalStatus: CodeableConceptSchema.optional(),
  contact: z.array(z.object({
    relationship: z.array(CodeableConceptSchema).optional(),
    name: HumanNameSchema.optional(),
    telecom: z.array(ContactPointSchema).optional(),
    address: AddressSchema.optional(),
  })).optional(),
  extension: z.array(z.object({
    url: z.string(),
    valueString: z.string().optional(),
    valueCode: z.string().optional(),
    valueBoolean: z.boolean().optional(),
  })).optional(),
}).refine(
  (data) => {
    // Check for Aadhaar in identifiers if present
    const aadhaarIdentifier = data.identifier?.find(
      (id) => id.system === 'https://uidai.gov.in/aadhaar'
    );
    if (aadhaarIdentifier) {
      return aadhaarRegex.test(aadhaarIdentifier.value);
    }
    return true;
  },
  {
    message: 'Invalid Aadhaar number format (must be 12 digits)',
    path: ['identifier'],
  }
).refine(
  (data) => {
    // Validate mobile numbers in telecom
    const mobileNumbers = data.telecom?.filter(
      (t) => t.system === 'phone' && t.use === 'mobile'
    );
    if (mobileNumbers && mobileNumbers.length > 0) {
      return mobileNumbers.every((m) => indianMobileRegex.test(m.value));
    }
    return true;
  },
  {
    message: 'Invalid Indian mobile number format',
    path: ['telecom'],
  }
);

// Observation Schema (FHIR) - for lab results and vital signs
export const ObservationSchema = z.object({
  resourceType: z.literal('Observation').default('Observation'),
  id: z.string().optional(),
  identifier: z.array(IdentifierSchema).optional(),
  status: z.enum(['registered', 'preliminary', 'final', 'amended', 'corrected', 'cancelled', 'entered-in-error', 'unknown']),
  category: z.array(CodeableConceptSchema).optional(),
  code: CodeableConceptSchema,
  subject: z.object({
    reference: z.string(),
    display: z.string().optional(),
  }),
  encounter: z.object({
    reference: z.string(),
    display: z.string().optional(),
  }).optional(),
  effectiveDateTime: z.string(),
  issued: z.string().optional(),
  performer: z.array(z.object({
    reference: z.string(),
    display: z.string().optional(),
  })).optional(),
  valueQuantity: z.object({
    value: z.number(),
    unit: z.string(),
    system: z.string().optional(),
    code: z.string().optional(),
  }).optional(),
  valueString: z.string().optional(),
  valueBoolean: z.boolean().optional(),
  valueInteger: z.number().optional(),
  valueCodeableConcept: CodeableConceptSchema.optional(),
  interpretation: z.array(CodeableConceptSchema).optional(),
  note: z.array(z.object({
    text: z.string(),
  })).optional(),
  referenceRange: z.array(z.object({
    low: z.object({
      value: z.number(),
      unit: z.string(),
    }).optional(),
    high: z.object({
      value: z.number(),
      unit: z.string(),
    }).optional(),
    type: CodeableConceptSchema.optional(),
    text: z.string().optional(),
  })).optional(),
});

// Encounter Schema (FHIR with ICD-10)
export const EncounterSchema = z.object({
  resourceType: z.literal('Encounter').default('Encounter'),
  id: z.string().optional(),
  identifier: z.array(IdentifierSchema).optional(),
  status: z.enum(['planned', 'arrived', 'triaged', 'in-progress', 'onleave', 'finished', 'cancelled', 'entered-in-error', 'unknown']),
  class: z.object({
    system: z.string(),
    code: z.string(),
    display: z.string().optional(),
  }),
  type: z.array(CodeableConceptSchema).optional(),
  priority: CodeableConceptSchema.optional(),
  subject: z.object({
    reference: z.string(),
    display: z.string().optional(),
  }),
  participant: z.array(z.object({
    type: z.array(CodeableConceptSchema).optional(),
    individual: z.object({
      reference: z.string(),
      display: z.string().optional(),
    }).optional(),
  })).optional(),
  period: z.object({
    start: z.string(),
    end: z.string().optional(),
  }).optional(),
  reasonCode: z.array(CodeableConceptSchema).optional(),
  diagnosis: z.array(z.object({
    condition: z.object({
      reference: z.string(),
      display: z.string().optional(),
    }),
    use: CodeableConceptSchema.optional(),
    rank: z.number().optional(),
  })).optional(),
  hospitalization: z.object({
    admitSource: CodeableConceptSchema.optional(),
    dischargeDisposition: CodeableConceptSchema.optional(),
  }).optional(),
}).refine(
  (data) => {
    // Validate ICD-10 codes in diagnosis
    if (data.diagnosis && data.diagnosis.length > 0) {
      return data.diagnosis.every((diag) => {
        const icd10Code = diag.condition.display;
        if (icd10Code) {
          // Extract code from display if it's in format "Code - Description"
          const codeMatch = icd10Code.match(/^([A-Z]\d{2}(?:\.[0-9A-Z]{1,4})?)/);
          if (codeMatch) {
            return icd10Regex.test(codeMatch[1]);
          }
        }
        return true;
      });
    }
    return true;
  },
  {
    message: 'Invalid ICD-10 diagnosis code format',
    path: ['diagnosis'],
  }
);

// Medication Schema (FHIR)
export const MedicationSchema = z.object({
  resourceType: z.literal('Medication').default('Medication'),
  id: z.string().optional(),
  identifier: z.array(IdentifierSchema).optional(),
  code: CodeableConceptSchema.optional(),
  status: z.enum(['active', 'inactive', 'entered-in-error']).optional(),
  manufacturer: z.object({
    reference: z.string(),
    display: z.string().optional(),
  }).optional(),
  form: CodeableConceptSchema.optional(),
  ingredient: z.array(z.object({
    itemCodeableConcept: CodeableConceptSchema.optional(),
    strength: z.object({
      numerator: z.object({
        value: z.number(),
        unit: z.string(),
      }).optional(),
      denominator: z.object({
        value: z.number(),
        unit: z.string(),
      }).optional(),
    }).optional(),
  })).optional(),
});

// MedicationRequest Schema (FHIR)
export const MedicationRequestSchema = z.object({
  resourceType: z.literal('MedicationRequest').default('MedicationRequest'),
  id: z.string().optional(),
  identifier: z.array(IdentifierSchema).optional(),
  status: z.enum(['active', 'on-hold', 'cancelled', 'completed', 'entered-in-error', 'stopped', 'draft', 'unknown']),
  intent: z.enum(['proposal', 'plan', 'order', 'original-order', 'reflex-order', 'filler-order', 'instance-order', 'option']),
  medicationCodeableConcept: CodeableConceptSchema.optional(),
  medicationReference: z.object({
    reference: z.string(),
    display: z.string().optional(),
  }).optional(),
  subject: z.object({
    reference: z.string(),
    display: z.string().optional(),
  }),
  encounter: z.object({
    reference: z.string(),
    display: z.string().optional(),
  }).optional(),
  authoredOn: z.string(),
  requester: z.object({
    reference: z.string(),
    display: z.string().optional(),
  }).optional(),
  dosageInstruction: z.array(z.object({
    sequence: z.number().optional(),
    text: z.string().optional(),
    timing: z.object({
      repeat: z.object({
        frequency: z.number().optional(),
        period: z.number().optional(),
        periodUnit: z.enum(['s', 'min', 'h', 'd', 'wk', 'mo', 'a']).optional(),
      }).optional(),
    }).optional(),
    route: CodeableConceptSchema.optional(),
    doseAndRate: z.array(z.object({
      type: CodeableConceptSchema.optional(),
      doseQuantity: z.object({
        value: z.number(),
        unit: z.string(),
      }).optional(),
    })).optional(),
  })).optional(),
  dispenseRequest: z.object({
    validityPeriod: z.object({
      start: z.string().optional(),
      end: z.string().optional(),
    }).optional(),
    numberOfRepeatsAllowed: z.number().optional(),
    quantity: z.object({
      value: z.number(),
      unit: z.string(),
    }).optional(),
    expectedSupplyDuration: z.object({
      value: z.number(),
      unit: z.string(),
    }).optional(),
  }).optional(),
});

// Invoice/Billing Schema (FHIR with INR)
export const InvoiceSchema = z.object({
  resourceType: z.literal('Invoice').default('Invoice'),
  id: z.string().optional(),
  identifier: z.array(IdentifierSchema).optional(),
  status: z.enum(['draft', 'issued', 'balanced', 'cancelled', 'entered-in-error']),
  type: CodeableConceptSchema.optional(),
  subject: z.object({
    reference: z.string(),
    display: z.string().optional(),
  }).optional(),
  recipient: z.object({
    reference: z.string(),
    display: z.string().optional(),
  }).optional(),
  date: z.string(),
  participant: z.array(z.object({
    role: CodeableConceptSchema.optional(),
    actor: z.object({
      reference: z.string(),
      display: z.string().optional(),
    }),
  })).optional(),
  lineItem: z.array(z.object({
    sequence: z.number().optional(),
    chargeItemCodeableConcept: CodeableConceptSchema.optional(),
    priceComponent: z.array(z.object({
      type: z.enum(['base', 'surcharge', 'deduction', 'discount', 'tax', 'informational']),
      code: CodeableConceptSchema.optional(),
      factor: z.number().optional(),
      amount: z.object({
        value: z.number(),
        currency: z.literal('INR').default('INR'),
      }),
    })).optional(),
  })),
  totalPriceComponent: z.array(z.object({
    type: z.enum(['base', 'surcharge', 'deduction', 'discount', 'tax', 'informational']),
    code: CodeableConceptSchema.optional(),
    amount: z.object({
      value: z.number(),
      currency: z.literal('INR').default('INR'),
    }),
  })).optional(),
  totalNet: z.object({
    value: z.number(),
    currency: z.literal('INR').default('INR'),
  }).optional(),
  totalGross: z.object({
    value: z.number(),
    currency: z.literal('INR').default('INR'),
  }).optional(),
  paymentTerms: z.string().optional(),
  note: z.array(z.object({
    text: z.string(),
  })).optional(),
});

// Export types inferred from schemas
export type Patient = z.infer<typeof PatientSchema>;
export type Observation = z.infer<typeof ObservationSchema>;
export type Encounter = z.infer<typeof EncounterSchema>;
export type Medication = z.infer<typeof MedicationSchema>;
export type MedicationRequest = z.infer<typeof MedicationRequestSchema>;
export type Invoice = z.infer<typeof InvoiceSchema>;
export type HumanName = z.infer<typeof HumanNameSchema>;
export type ContactPoint = z.infer<typeof ContactPointSchema>;
export type Address = z.infer<typeof AddressSchema>;
export type Identifier = z.infer<typeof IdentifierSchema>;
export type CodeableConcept = z.infer<typeof CodeableConceptSchema>;
