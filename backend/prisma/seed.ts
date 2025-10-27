import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// NOTE: This seed script is for development/testing purposes only and generates DEMO data.
// Math.random() is used here for convenience in generating fake data and is NOT used for
// any security-sensitive operations. In production, real patient data would be entered
// through the application with proper validation and security measures.

// Helper function to generate random Indian names
const firstNames = {
  male: ['Rajesh', 'Amit', 'Suresh', 'Vikram', 'Anil', 'Rahul', 'Sanjay', 'Deepak', 'Arjun', 'Karan', 'Rohan', 'Nikhil', 'Akash', 'Vishal', 'Pradeep', 'Manish', 'Pankaj', 'Santosh', 'Ravi', 'Ashok'],
  female: ['Priya', 'Sunita', 'Anjali', 'Kavita', 'Neha', 'Pooja', 'Rekha', 'Sangeeta', 'Divya', 'Meera', 'Sneha', 'Jyoti', 'Shalini', 'Ritu', 'Anita', 'Swati', 'Nisha', 'Sapna', 'Geeta', 'Preeti'],
};

const lastNames = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Gupta', 'Reddy', 'Verma', 'Agarwal', 'Jain', 'Mehta', 'Nair', 'Iyer', 'Rao', 'Desai', 'Malhotra', 'Chopra', 'Bhat', 'Menon', 'Pillai', 'Kaur'];

const cities = [
  { city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
  { city: 'Delhi', state: 'Delhi', pincode: '110001' },
  { city: 'Bangalore', state: 'Karnataka', pincode: '560001' },
  { city: 'Chennai', state: 'Tamil Nadu', pincode: '600001' },
  { city: 'Kolkata', state: 'West Bengal', pincode: '700001' },
  { city: 'Hyderabad', state: 'Telangana', pincode: '500001' },
  { city: 'Pune', state: 'Maharashtra', pincode: '411001' },
  { city: 'Ahmedabad', state: 'Gujarat', pincode: '380001' },
  { city: 'Jaipur', state: 'Rajasthan', pincode: '302001' },
  { city: 'Lucknow', state: 'Uttar Pradesh', pincode: '226001' },
];

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const commonAllergies = ['None', 'Penicillin', 'Dust', 'Pollen', 'Peanuts', 'Sulfa drugs', 'Aspirin'];
const medicalConditions = [
  'Diabetes Type 2',
  'Hypertension',
  'Asthma',
  'None',
  'Thyroid disorder',
  'Arthritis',
  'Heart disease',
  'COPD',
  'Gastritis',
  'Migraine',
];

// Helper to generate random date in DD-MM-YYYY format
function randomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

// Helper to generate masked Aadhaar
function generateAadhaar(index: number): string {
  const base = 1000 + index;
  return `XXXX-XXXX-${String(base).padStart(4, '0')}`;
}

// Helper to generate phone number
function generatePhone(): string {
  const number = Math.floor(6000000000 + Math.random() * 4000000000);
  return `+91${number}`;
}

async function main() {
  console.log('Starting database seed...');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@hospital.in' },
    update: {},
    create: {
      email: 'admin@hospital.in',
      password: hashedPassword,
      name: 'Dr. Rajesh Kumar',
      role: 'ADMIN',
    },
  });

  const doctor1 = await prisma.user.upsert({
    where: { email: 'doctor1@hospital.in' },
    update: {},
    create: {
      email: 'doctor1@hospital.in',
      password: hashedPassword,
      name: 'Dr. Priya Sharma',
      role: 'DOCTOR',
    },
  });

  const doctor2 = await prisma.user.upsert({
    where: { email: 'doctor2@hospital.in' },
    update: {},
    create: {
      email: 'doctor2@hospital.in',
      password: hashedPassword,
      name: 'Dr. Amit Patel',
      role: 'DOCTOR',
    },
  });

  const nurse = await prisma.user.upsert({
    where: { email: 'nurse@hospital.in' },
    update: {},
    create: {
      email: 'nurse@hospital.in',
      password: hashedPassword,
      name: 'Nurse Anjali Singh',
      role: 'NURSE',
    },
  });

  const labTech = await prisma.user.upsert({
    where: { email: 'labtech@hospital.in' },
    update: {},
    create: {
      email: 'labtech@hospital.in',
      password: hashedPassword,
      name: 'Lab Tech Suresh Reddy',
      role: 'LAB_TECH',
    },
  });

  const pharmacist = await prisma.user.upsert({
    where: { email: 'pharmacist@hospital.in' },
    update: {},
    create: {
      email: 'pharmacist@hospital.in',
      password: hashedPassword,
      name: 'Pharmacist Kavita Gupta',
      role: 'PHARMACIST',
    },
  });

  const billing = await prisma.user.upsert({
    where: { email: 'billing@hospital.in' },
    update: {},
    create: {
      email: 'billing@hospital.in',
      password: hashedPassword,
      name: 'Billing Officer Rahul Verma',
      role: 'BILLING',
    },
  });

  console.log('Users created:', { admin, doctor1, doctor2, nurse, labTech, pharmacist, billing });

  // Create roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
      displayName: 'Administrator',
      description: 'Full system access and management',
      permissions: ['all'],
    },
  });

  const doctorRole = await prisma.role.upsert({
    where: { name: 'DOCTOR' },
    update: {},
    create: {
      name: 'DOCTOR',
      displayName: 'Medical Doctor',
      description: 'Can manage patients, encounters, prescriptions',
      permissions: ['patient:read', 'patient:write', 'encounter:read', 'encounter:write', 'prescription:read', 'prescription:write'],
    },
  });

  console.log('Roles created:', { adminRole, doctorRole });

  // Create 50 demo patients
  const patients = [];
  const doctors = [doctor1, doctor2];

  for (let i = 0; i < 50; i++) {
    const gender = i % 3 === 0 ? 'FEMALE' : i % 3 === 1 ? 'MALE' : 'OTHER';
    const genderKey = gender === 'FEMALE' ? 'female' : 'male';
    const firstName = firstNames[genderKey][i % firstNames[genderKey].length];
    const lastName = lastNames[i % lastNames.length];
    const location = cities[i % cities.length];
    
    const patient = await prisma.patient.create({
      data: {
        firstName,
        lastName,
        dateOfBirth: randomDate(new Date(1950, 0, 1), new Date(2010, 11, 31)),
        gender,
        phone: generatePhone(),
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
        aadhaar: generateAadhaar(i),
        address: `${100 + i} MG Road, ${location.city}`,
        city: location.city,
        state: location.state,
        pincode: location.pincode,
        emergencyContact: `${firstName === 'Rajesh' ? 'Priya' : 'Rajesh'} ${lastName} (Spouse)`,
        emergencyPhone: generatePhone(),
        bloodGroup: bloodGroups[i % bloodGroups.length],
        allergies: commonAllergies[i % commonAllergies.length],
        medicalHistory: medicalConditions[i % medicalConditions.length],
        registrationDate: randomDate(new Date(2023, 0, 1), new Date(2024, 11, 31)),
      },
    });
    patients.push(patient);
  }

  console.log(`Created ${patients.length} patients`);

  // Create encounters for some patients
  const encounterTypes = ['CONSULTATION', 'FOLLOWUP', 'EMERGENCY'];
  const chiefComplaints = [
    'Fever and body ache',
    'Chest pain',
    'Headache',
    'Abdominal pain',
    'Difficulty breathing',
    'High blood sugar levels',
    'Joint pain',
    'Skin rash',
    'Persistent cough',
    'Dizziness',
  ];
  const diagnoses = [
    'Viral fever',
    'Hypertension',
    'Migraine',
    'Gastritis',
    'Upper respiratory infection',
    'Diabetes Type 2',
    'Osteoarthritis',
    'Dermatitis',
    'Bronchitis',
    'Vertigo',
  ];

  for (let i = 0; i < 30; i++) {
    const patient = patients[i];
    const doctor = doctors[i % doctors.length];
    const encounterType = encounterTypes[i % encounterTypes.length];
    const complaint = chiefComplaints[i % chiefComplaints.length];
    const diagnosis = diagnoses[i % diagnoses.length];

    const encounter = await prisma.encounter.create({
      data: {
        patientId: patient.id,
        doctorId: doctor.id,
        date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        type: encounterType as any,
        chiefComplaint: complaint,
        diagnosis: diagnosis,
        diagnosisCode: `E${10 + i}.${i % 10}`,
        notes: `Patient presented with ${complaint.toLowerCase()}. Physical examination conducted. ${diagnosis} diagnosed.`,
        status: i % 4 === 0 ? 'SCHEDULED' : 'COMPLETED',
        vitalSigns: {
          temperature: 97 + Math.random() * 2,
          bloodPressure: `${120 + Math.floor(Math.random() * 30)}/${70 + Math.floor(Math.random() * 20)}`,
          heartRate: 60 + Math.floor(Math.random() * 40),
          respiratoryRate: 12 + Math.floor(Math.random() * 8),
          spo2: 95 + Math.floor(Math.random() * 5),
          weight: 50 + Math.floor(Math.random() * 50),
          height: 150 + Math.floor(Math.random() * 40),
        },
      },
    });

    // Create observations for this encounter
    await prisma.observation.create({
      data: {
        patientId: patient.id,
        encounterId: encounter.id,
        recordedById: doctor.id,
        date: encounter.date,
        type: 'VITAL_SIGN',
        category: 'vital-signs',
        code: '8310-5',
        display: 'Body temperature',
        value: { value: 98.6, unit: '°F' },
        unit: '°F',
        interpretation: 'normal',
        status: 'FINAL',
      },
    });

    // Create lab results for some encounters
    if (i % 3 === 0) {
      const tests = [
        { name: 'Complete Blood Count', category: 'Hematology', result: 'Normal', range: 'WBC: 4-11, RBC: 4.5-5.5', unit: '10^9/L' },
        { name: 'HbA1c', category: 'Blood Test', result: '7.2', range: '4.0-5.6', unit: '%' },
        { name: 'Lipid Profile', category: 'Blood Test', result: 'Total Cholesterol: 210', range: '<200', unit: 'mg/dL' },
        { name: 'Liver Function Test', category: 'Blood Test', result: 'Normal', range: 'ALT: 7-56, AST: 10-40', unit: 'U/L' },
      ];
      
      const test = tests[i % tests.length];
      await prisma.labResult.create({
        data: {
          patientId: patient.id,
          encounterId: encounter.id,
          testName: test.name,
          testCategory: test.category,
          orderedDate: encounter.date,
          reportDate: new Date(encounter.date.getTime() + 24 * 60 * 60 * 1000),
          status: 'COMPLETED',
          results: test.result,
          normalRange: test.range,
          unit: test.unit,
          remarks: i % 2 === 0 ? 'Normal' : 'Slightly elevated',
          orderedById: doctor.id,
        },
      });
    }

    // Create medications for some encounters
    if (i % 2 === 0) {
      const medications = [
        { name: 'Metformin', generic: 'Metformin HCl', dosage: '500mg', form: 'Tablet', route: 'Oral', frequency: 'Twice daily', duration: '30 days', price: 5 },
        { name: 'Paracetamol', generic: 'Acetaminophen', dosage: '500mg', form: 'Tablet', route: 'Oral', frequency: 'Three times daily', duration: '5 days', price: 2 },
        { name: 'Amoxicillin', generic: 'Amoxicillin', dosage: '500mg', form: 'Capsule', route: 'Oral', frequency: 'Three times daily', duration: '7 days', price: 10 },
        { name: 'Amlodipine', generic: 'Amlodipine Besylate', dosage: '5mg', form: 'Tablet', route: 'Oral', frequency: 'Once daily', duration: '30 days', price: 8 },
      ];

      const med = medications[i % medications.length];
      const quantity = parseInt(med.duration) * (med.frequency.includes('Twice') ? 2 : med.frequency.includes('Three') ? 3 : 1);
      
      await prisma.medication.create({
        data: {
          patientId: patient.id,
          encounterId: encounter.id,
          prescribedById: doctor.id,
          name: med.name,
          genericName: med.generic,
          brandName: med.name,
          dosage: med.dosage,
          form: med.form,
          route: med.route,
          frequency: med.frequency,
          duration: med.duration,
          quantity: quantity,
          instructions: `Take ${med.dosage} ${med.frequency.toLowerCase()} after meals`,
          indication: diagnosis,
          startDate: encounter.date,
          status: 'ACTIVE',
          pricePerUnit: med.price,
          totalCost: med.price * quantity,
        },
      });
    }

    // Create prescriptions (old format for compatibility)
    if (i % 2 === 0) {
      await prisma.prescription.create({
        data: {
          patientId: patient.id,
          encounterId: encounter.id,
          doctorId: doctor.id,
          date: encounter.date,
          medications: [
            {
              name: 'Paracetamol',
              dosage: '500mg',
              frequency: 'Three times daily',
              duration: '5 days',
              route: 'Oral',
              instructions: 'Take after meals',
            },
          ],
          instructions: 'Complete the full course. Drink plenty of water.',
          status: 'ACTIVE',
        },
      });
    }

    // Create bills
    const consultationFee = encounterType === 'EMERGENCY' ? 1000 : encounterType === 'FOLLOWUP' ? 300 : 500;
    const items = [
      { name: 'Consultation Fee', quantity: 1, rate: consultationFee, amount: consultationFee },
    ];

    if (i % 3 === 0) {
      items.push({ name: 'Lab Tests', quantity: 1, rate: 800, amount: 800 });
    }

    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + tax;

    await prisma.bill.create({
      data: {
        patientId: patient.id,
        encounterId: encounter.id,
        date: encounter.date,
        items: items,
        subtotal: subtotal,
        tax: tax,
        discount: 0,
        total: total,
        currency: 'INR',
        paymentMethod: i % 3 === 0 ? 'UPI' : i % 3 === 1 ? 'CASH' : 'CARD',
        paymentStatus: i % 5 === 0 ? 'PENDING' : 'PAID',
        notes: i % 5 === 0 ? 'Pending payment' : 'Payment received',
      },
    });
  }

  console.log('Created encounters, observations, lab results, medications, prescriptions, and bills');

  // Create audit logs
  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: 'LOGIN',
      entity: 'User',
      entityId: admin.id,
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0',
      timestamp: new Date(),
      status: 'SUCCESS',
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: doctor1.id,
      action: 'CREATE',
      entity: 'Patient',
      entityId: patients[0].id,
      changes: { action: 'Created new patient record' },
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0',
      timestamp: new Date(),
      status: 'SUCCESS',
    },
  });

  console.log('Created audit logs');

  console.log('Database seed completed successfully!');
  console.log(`Summary:
  - Users: 7
  - Roles: 2
  - Patients: 50
  - Encounters: 30
  - Observations: 30
  - Lab Results: 10
  - Medications: 15
  - Prescriptions: 15
  - Bills: 30
  - Audit Logs: 2
  `);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
