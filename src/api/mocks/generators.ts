/**
 * Mock data generators for patients, encounters, labs, etc.
 */

import { Patient, Encounter, LabResult, Prescription, Medication } from '../../types/index';
import { Drug, ICD10Code } from '../schema';

// Helper utilities
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement<T>(array: T[]): T {
  return array[randomInt(0, array.length - 1)];
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

// Sample data pools
const firstNames = [
  'Amit',
  'Priya',
  'Rajesh',
  'Kavita',
  'Suresh',
  'Lakshmi',
  'Mohammed',
  'Ayesha',
  'Vikram',
  'Sneha',
  'Ramesh',
  'Deepa',
  'Arun',
  'Meera',
  'Vijay',
  'Nisha',
  'Sandeep',
  'Anjali',
  'Manoj',
  'Pooja',
  'Kiran',
  'Divya',
  'Ravi',
  'Swati',
  'Ashok',
  'Rekha',
  'Prakash',
  'Sunita',
  'Sanjay',
  'Geeta',
  'Nitin',
  'Shalini',
  'Sunil',
  'Anita',
  'Dinesh',
  'Preeti',
  'Mahesh',
  'Savita',
  'Anil',
  'Rina',
  'Harish',
  'Shilpa',
  'Pankaj',
  'Vaishali',
  'Rohit',
  'Neha',
  'Alok',
  'Manisha',
  'Naveen',
  'Jyoti',
  'Satish',
  'Pallavi',
];

const lastNames = [
  'Sharma',
  'Patel',
  'Kumar',
  'Singh',
  'Reddy',
  'Rao',
  'Khan',
  'Joshi',
  'Gupta',
  'Verma',
  'Desai',
  'Shah',
  'Mehta',
  'Nair',
  'Iyer',
  'Pillai',
  'Menon',
  'Das',
  'Bose',
  'Ghosh',
  'Roy',
  'Mukherjee',
  'Chatterjee',
  'Banerjee',
  'Agarwal',
  'Saxena',
  'Srivastava',
  'Mishra',
  'Pandey',
  'Jain',
  'Malhotra',
  'Kapoor',
  'Chopra',
  'Sethi',
  'Arora',
  'Khanna',
  'Bhatia',
  'Anand',
  'Chawla',
  'Goyal',
  'Bhatt',
  'Trivedi',
  'Doshi',
  'Kulkarni',
  'Patil',
  'Naik',
  'Hegde',
  'Shetty',
  'Kamath',
  'Raman',
];

const cities = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
  'Kanpur',
  'Nagpur',
  'Indore',
  'Thane',
  'Bhopal',
  'Visakhapatnam',
  'Patna',
  'Vadodara',
  'Ghaziabad',
  'Ludhiana',
  'Agra',
  'Nashik',
  'Faridabad',
  'Meerut',
  'Rajkot',
  'Kalyan',
  'Vasai',
  'Varanasi',
  'Srinagar',
  'Aurangabad',
  'Dhanbad',
  'Amritsar',
];

const states = [
  'Maharashtra',
  'Delhi',
  'Karnataka',
  'Telangana',
  'Tamil Nadu',
  'West Bengal',
  'Gujarat',
  'Rajasthan',
  'Uttar Pradesh',
  'Madhya Pradesh',
  'Andhra Pradesh',
  'Bihar',
  'Punjab',
  'Haryana',
  'Odisha',
  'Kerala',
  'Jharkhand',
  'Assam',
  'Uttarakhand',
  'Himachal Pradesh',
];

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const allergies = [
  'None',
  'Penicillin',
  'Sulfa drugs',
  'Aspirin',
  'NSAIDs',
  'Latex',
  'Dust, Pollen',
  'Seafood',
  'Nuts',
  'Dairy products',
];

const medicalHistories = [
  'None',
  'Essential Hypertension (controlled)',
  'Type 2 Diabetes Mellitus (on medication)',
  'Asthma (well controlled)',
  'Hypothyroidism',
  'GERD',
  'Migraine',
  'Coronary Artery Disease, Post-CABG',
  'Chronic Kidney Disease Stage 3',
  'Type 2 Diabetes, Dyslipidemia',
  'Osteoarthritis',
  'Depression (stable on medication)',
  'Chronic Obstructive Pulmonary Disease',
  'Atrial Fibrillation',
  'Rheumatoid Arthritis',
];

// ICD-10 Codes data
const icd10CodesData: ICD10Code[] = [
  {
    code: 'J06.9',
    description: 'Acute upper respiratory infection, unspecified',
    category: 'Respiratory',
    subcategory: 'Upper respiratory infections',
  },
  {
    code: 'E11.9',
    description: 'Type 2 diabetes mellitus without complications',
    category: 'Endocrine',
    subcategory: 'Diabetes mellitus',
  },
  {
    code: 'I25.1',
    description: 'Atherosclerotic heart disease of native coronary artery',
    category: 'Cardiovascular',
    subcategory: 'Ischemic heart diseases',
  },
  {
    code: 'J45.9',
    description: 'Asthma, unspecified',
    category: 'Respiratory',
    subcategory: 'Chronic lower respiratory diseases',
  },
  {
    code: 'I10',
    description: 'Essential (primary) hypertension',
    category: 'Cardiovascular',
    subcategory: 'Hypertensive diseases',
  },
  {
    code: 'Z48.8',
    description: 'Other specified surgical follow-up care',
    category: 'Factors influencing health',
    subcategory: 'Follow-up care',
  },
  {
    code: 'M79.3',
    description: 'Panniculitis, unspecified',
    category: 'Musculoskeletal',
    subcategory: 'Soft tissue disorders',
  },
  {
    code: 'K21.9',
    description: 'Gastro-esophageal reflux disease without esophagitis',
    category: 'Digestive',
    subcategory: 'Diseases of esophagus',
  },
  {
    code: 'E03.9',
    description: 'Hypothyroidism, unspecified',
    category: 'Endocrine',
    subcategory: 'Thyroid disorders',
  },
  {
    code: 'G43.9',
    description: 'Migraine, unspecified',
    category: 'Neurological',
    subcategory: 'Episodic and paroxysmal disorders',
  },
  {
    code: 'A09',
    description: 'Infectious gastroenteritis and colitis, unspecified',
    category: 'Infectious',
    subcategory: 'Intestinal infections',
  },
  {
    code: 'J18.9',
    description: 'Pneumonia, unspecified organism',
    category: 'Respiratory',
    subcategory: 'Pneumonia',
  },
  {
    code: 'N39.0',
    description: 'Urinary tract infection, site not specified',
    category: 'Genitourinary',
    subcategory: 'Urinary tract infections',
  },
  {
    code: 'M25.5',
    description: 'Pain in joint',
    category: 'Musculoskeletal',
    subcategory: 'Joint disorders',
  },
  {
    code: 'E78.5',
    description: 'Hyperlipidemia, unspecified',
    category: 'Endocrine',
    subcategory: 'Metabolic disorders',
  },
  {
    code: 'F32.9',
    description: 'Major depressive disorder, single episode, unspecified',
    category: 'Mental',
    subcategory: 'Mood disorders',
  },
  {
    code: 'J44.9',
    description: 'Chronic obstructive pulmonary disease, unspecified',
    category: 'Respiratory',
    subcategory: 'Chronic lower respiratory diseases',
  },
  {
    code: 'I48.91',
    description: 'Unspecified atrial fibrillation',
    category: 'Cardiovascular',
    subcategory: 'Cardiac arrhythmias',
  },
  {
    code: 'M06.9',
    description: 'Rheumatoid arthritis, unspecified',
    category: 'Musculoskeletal',
    subcategory: 'Inflammatory polyarthropathies',
  },
  {
    code: 'N18.3',
    description: 'Chronic kidney disease, stage 3',
    category: 'Genitourinary',
    subcategory: 'Chronic kidney disease',
  },
  { code: 'R51', description: 'Headache', category: 'Symptoms', subcategory: 'General symptoms' },
  {
    code: 'R50.9',
    description: 'Fever, unspecified',
    category: 'Symptoms',
    subcategory: 'General symptoms',
  },
  { code: 'R05', description: 'Cough', category: 'Symptoms', subcategory: 'Respiratory symptoms' },
  {
    code: 'R07.9',
    description: 'Chest pain, unspecified',
    category: 'Symptoms',
    subcategory: 'Cardiovascular symptoms',
  },
  {
    code: 'R10.9',
    description: 'Unspecified abdominal pain',
    category: 'Symptoms',
    subcategory: 'Digestive symptoms',
  },
];

// Drugs data
const drugsData: Drug[] = [
  {
    id: 'D001',
    name: 'Paracetamol',
    genericName: 'Acetaminophen',
    category: 'Analgesic',
    dosageForm: 'Tablet',
    strength: '500mg',
    manufacturer: 'Cipla',
    price: 25,
    stock: 1000,
    rxRequired: false,
  },
  {
    id: 'D002',
    name: 'Azithromycin',
    genericName: 'Azithromycin',
    category: 'Antibiotic',
    dosageForm: 'Tablet',
    strength: '500mg',
    manufacturer: 'Sun Pharma',
    price: 180,
    stock: 500,
    rxRequired: true,
  },
  {
    id: 'D003',
    name: 'Metformin',
    genericName: 'Metformin HCl',
    category: 'Antidiabetic',
    dosageForm: 'Tablet',
    strength: '500mg',
    manufacturer: 'USV',
    price: 120,
    stock: 800,
    rxRequired: true,
  },
  {
    id: 'D004',
    name: 'Atorvastatin',
    genericName: 'Atorvastatin Calcium',
    category: 'Lipid lowering',
    dosageForm: 'Tablet',
    strength: '20mg',
    manufacturer: 'Ranbaxy',
    price: 180,
    stock: 600,
    rxRequired: true,
  },
  {
    id: 'D005',
    name: 'Aspirin',
    genericName: 'Acetylsalicylic Acid',
    category: 'Antiplatelet',
    dosageForm: 'Tablet',
    strength: '75mg',
    manufacturer: 'Bayer',
    price: 45,
    stock: 900,
    rxRequired: true,
  },
  {
    id: 'D006',
    name: 'Amlodipine',
    genericName: 'Amlodipine Besylate',
    category: 'Antihypertensive',
    dosageForm: 'Tablet',
    strength: '5mg',
    manufacturer: 'Pfizer',
    price: 95,
    stock: 700,
    rxRequired: true,
  },
  {
    id: 'D007',
    name: 'Omeprazole',
    genericName: 'Omeprazole',
    category: 'Proton pump inhibitor',
    dosageForm: 'Capsule',
    strength: '20mg',
    manufacturer: "Dr. Reddy's",
    price: 110,
    stock: 650,
    rxRequired: true,
  },
  {
    id: 'D008',
    name: 'Levothyroxine',
    genericName: 'Levothyroxine Sodium',
    category: 'Thyroid hormone',
    dosageForm: 'Tablet',
    strength: '50mcg',
    manufacturer: 'Abbott',
    price: 85,
    stock: 550,
    rxRequired: true,
  },
  {
    id: 'D009',
    name: 'Salbutamol Inhaler',
    genericName: 'Salbutamol',
    category: 'Bronchodilator',
    dosageForm: 'Inhaler',
    strength: '100mcg',
    manufacturer: 'GSK',
    price: 250,
    stock: 400,
    rxRequired: true,
  },
  {
    id: 'D010',
    name: 'Cetirizine',
    genericName: 'Cetirizine HCl',
    category: 'Antihistamine',
    dosageForm: 'Tablet',
    strength: '10mg',
    manufacturer: 'Cipla',
    price: 40,
    stock: 850,
    rxRequired: false,
  },
  {
    id: 'D011',
    name: 'Ibuprofen',
    genericName: 'Ibuprofen',
    category: 'NSAID',
    dosageForm: 'Tablet',
    strength: '400mg',
    manufacturer: 'Abbott',
    price: 60,
    stock: 750,
    rxRequired: false,
  },
  {
    id: 'D012',
    name: 'Amoxicillin',
    genericName: 'Amoxicillin',
    category: 'Antibiotic',
    dosageForm: 'Capsule',
    strength: '500mg',
    manufacturer: 'Ranbaxy',
    price: 140,
    stock: 600,
    rxRequired: true,
  },
  {
    id: 'D013',
    name: 'Losartan',
    genericName: 'Losartan Potassium',
    category: 'Antihypertensive',
    dosageForm: 'Tablet',
    strength: '50mg',
    manufacturer: 'Torrent',
    price: 125,
    stock: 520,
    rxRequired: true,
  },
  {
    id: 'D014',
    name: 'Glimepiride',
    genericName: 'Glimepiride',
    category: 'Antidiabetic',
    dosageForm: 'Tablet',
    strength: '2mg',
    manufacturer: 'Sanofi',
    price: 145,
    stock: 480,
    rxRequired: true,
  },
  {
    id: 'D015',
    name: 'Montelukast',
    genericName: 'Montelukast Sodium',
    category: 'Leukotriene receptor antagonist',
    dosageForm: 'Tablet',
    strength: '10mg',
    manufacturer: 'Merck',
    price: 195,
    stock: 420,
    rxRequired: true,
  },
];

// Generate patients
export function generatePatients(count: number): Patient[] {
  const patients: Patient[] = [];
  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  for (let i = 0; i < count; i++) {
    const firstName = randomElement(firstNames);
    const lastName = randomElement(lastNames);
    const gender = Math.random() > 0.5 ? 'male' : 'female';
    const birthDate = randomDate(new Date(1940, 0, 1), new Date(2005, 11, 31));
    const registrationDate = randomDate(oneYearAgo, today);
    const city = randomElement(cities);
    const state = randomElement(states);

    patients.push({
      id: `P${String(i + 1).padStart(3, '0')}`,
      firstName,
      lastName,
      dateOfBirth: formatDate(birthDate),
      gender,
      phone: `+919${String(randomInt(100000000, 999999999))}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      aadhaar: String(randomInt(100000000000, 999999999999)),
      address: `${randomInt(1, 999)}, ${randomElement(['MG Road', 'Main Street', 'Park Avenue', 'Station Road', 'Gandhi Nagar'])}`,
      city,
      state,
      pincode: String(randomInt(100000, 999999)),
      emergencyContact: `${randomElement(firstNames)} ${lastName}`,
      emergencyPhone: `+919${String(randomInt(100000000, 999999999))}`,
      bloodGroup: randomElement(bloodGroups),
      allergies: randomElement(allergies),
      medicalHistory: randomElement(medicalHistories),
      registrationDate: formatDate(registrationDate),
    });
  }

  return patients;
}

// Generate encounters
export function generateEncounters(count: number, patients: Patient[]): Encounter[] {
  const encounters: Encounter[] = [];
  const encounterTypes = ['consultation', 'followup', 'emergency'] as const;
  const statuses = ['scheduled', 'in-progress', 'completed', 'cancelled'] as const;
  const today = new Date();
  const threeMonthsAgo = new Date(today);
  threeMonthsAgo.setMonth(today.getMonth() - 3);

  const chiefComplaints = [
    'Fever and headache',
    'Cough and cold',
    'Chest pain',
    'Abdominal pain',
    'Dizziness',
    'Nausea and vomiting',
    'Back pain',
    'Joint pain',
    'Shortness of breath',
    'Skin rash',
    'Fatigue',
    'Headache',
    'Sore throat',
    'Ear pain',
    'Vision problems',
    'Anxiety',
    'Follow-up for diabetes management',
    'Follow-up for hypertension',
    'Post-surgical follow-up',
    'Routine check-up',
  ];

  for (let i = 0; i < count; i++) {
    const patient = randomElement(patients);
    const encounterDate = randomDate(threeMonthsAgo, today);
    const type = randomElement(encounterTypes);
    const status = randomElement(statuses);
    const icd10 = randomElement(icd10CodesData);

    encounters.push({
      id: `E${String(i + 1).padStart(3, '0')}`,
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      doctorId: String(randomInt(1, 6)),
      doctorName: `Dr. ${randomElement(firstNames)} ${randomElement(lastNames)}`,
      date: encounterDate.toISOString(),
      type,
      chiefComplaint: randomElement(chiefComplaints),
      diagnosis: icd10.description,
      diagnosisCode: icd10.code,
      notes: 'Patient examined and advised treatment. Follow-up scheduled.',
      status,
      vitalSigns: {
        temperature: randomInt(97, 103) + Math.random(),
        bloodPressure: `${randomInt(110, 150)}/${randomInt(70, 95)}`,
        heartRate: randomInt(60, 100),
        respiratoryRate: randomInt(12, 20),
        spo2: randomInt(94, 100),
        weight: randomInt(45, 100),
        height: randomInt(150, 185),
      },
    });
  }

  return encounters.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Generate lab results
export function generateLabResults(
  count: number,
  patients: Patient[],
  encounters: Encounter[]
): LabResult[] {
  const labResults: LabResult[] = [];
  const testCategories = [
    'Hematology',
    'Biochemistry',
    'Microbiology',
    'Cardiology',
    'Radiology',
    'Pathology',
  ];
  const tests = {
    Hematology: ['Complete Blood Count', 'ESR', 'Hemoglobin', 'Platelet Count'],
    Biochemistry: [
      'Fasting Blood Sugar',
      'HbA1c',
      'Lipid Profile',
      'Liver Function Test',
      'Kidney Function Test',
      'Thyroid Profile',
    ],
    Microbiology: ['Urine Culture', 'Blood Culture', 'Throat Swab'],
    Cardiology: ['ECG', 'Echocardiography', 'Stress Test', 'Troponin-I Test'],
    Radiology: ['X-Ray Chest', 'CT Scan', 'MRI', 'Ultrasound'],
    Pathology: ['Biopsy', 'Pap Smear', 'Histopathology'],
  };
  const statuses = ['pending', 'in-progress', 'completed'] as const;

  for (let i = 0; i < count; i++) {
    const encounter = randomElement(encounters);
    const category = randomElement(testCategories) as keyof typeof tests;
    const testName = randomElement(tests[category]);
    const status = randomElement(statuses);
    const orderedDate = new Date(encounter.date);
    const reportDate =
      status === 'completed'
        ? new Date(orderedDate.getTime() + randomInt(2, 72) * 60 * 60 * 1000)
        : undefined;

    labResults.push({
      id: `L${String(i + 1).padStart(3, '0')}`,
      patientId: encounter.patientId,
      patientName: encounter.patientName,
      encounterId: encounter.id,
      testName,
      testCategory: category,
      orderedDate: orderedDate.toISOString(),
      reportDate: reportDate?.toISOString(),
      status,
      results: status === 'completed' ? 'Within normal limits' : undefined,
      normalRange: status === 'completed' ? 'Reference range provided' : undefined,
      unit: 'Various',
      remarks: status === 'completed' ? 'No abnormalities detected' : undefined,
      orderedBy: encounter.doctorName,
    });
  }

  return labResults.sort(
    (a, b) => new Date(b.orderedDate).getTime() - new Date(a.orderedDate).getTime()
  );
}

// Generate prescriptions
export function generatePrescriptions(encounters: Encounter[]): Prescription[] {
  const prescriptions: Prescription[] = [];
  const statuses = ['active', 'completed', 'discontinued'] as const;

  // Generate 1-2 prescriptions per completed encounter
  encounters
    .filter((e) => e.status === 'completed')
    .forEach((encounter) => {
      const medications: Medication[] = [];
      const numMedications = randomInt(1, 3);

      for (let i = 0; i < numMedications; i++) {
        const drug = randomElement(drugsData);
        medications.push({
          name: drug.name,
          dosage: drug.strength,
          frequency: randomElement(['Once daily', '2 times daily', '3 times daily', 'As needed']),
          duration: randomElement(['3 days', '5 days', '7 days', '14 days', '30 days']),
          route: randomElement(['Oral', 'Topical', 'Inhalation']),
          instructions: randomElement([
            'Take after meals',
            'Take before meals',
            'Take with water',
            'Apply as directed',
          ]),
        });
      }

      prescriptions.push({
        id: `Rx${String(prescriptions.length + 1).padStart(3, '0')}`,
        patientId: encounter.patientId,
        patientName: encounter.patientName,
        encounterId: encounter.id,
        doctorId: encounter.doctorId,
        doctorName: encounter.doctorName,
        date: encounter.date,
        medications,
        instructions:
          'Follow medication schedule as prescribed. Contact doctor if any adverse effects.',
        status: randomElement(statuses),
      });
    });

  return prescriptions;
}

export { icd10CodesData, drugsData };
