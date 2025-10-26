import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

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

  const doctor = await prisma.user.upsert({
    where: { email: 'doctor@hospital.in' },
    update: {},
    create: {
      email: 'doctor@hospital.in',
      password: hashedPassword,
      name: 'Dr. Priya Sharma',
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

  console.log('Users created:', { admin, doctor, nurse });

  // Create sample patients
  const patient1 = await prisma.patient.create({
    data: {
      firstName: 'Amit',
      lastName: 'Sharma',
      dateOfBirth: '15-06-1990',
      gender: 'MALE',
      phone: '+919876543210',
      email: 'amit.sharma@example.com',
      aadhaar: '1234-5678-9012',
      address: '123 MG Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      emergencyContact: 'Priya Sharma (Wife)',
      emergencyPhone: '+919876543211',
      bloodGroup: 'O+',
      allergies: 'None',
      medicalHistory: 'Diabetes Type 2',
      registrationDate: '01-01-2024',
    },
  });

  const patient2 = await prisma.patient.create({
    data: {
      firstName: 'Sunita',
      lastName: 'Patel',
      dateOfBirth: '22-03-1985',
      gender: 'FEMALE',
      phone: '+919876543212',
      email: 'sunita.patel@example.com',
      aadhaar: '2345-6789-0123',
      address: '456 Park Street',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
      emergencyContact: 'Rakesh Patel (Husband)',
      emergencyPhone: '+919876543213',
      bloodGroup: 'A+',
      allergies: 'Penicillin',
      medicalHistory: 'Hypertension',
      registrationDate: '15-01-2024',
    },
  });

  console.log('Patients created:', { patient1, patient2 });

  // Create sample encounter
  const encounter1 = await prisma.encounter.create({
    data: {
      patientId: patient1.id,
      doctorId: doctor.id,
      date: new Date('2024-02-01'),
      type: 'CONSULTATION',
      chiefComplaint: 'High blood sugar levels',
      diagnosis: 'Diabetes Type 2 - Uncontrolled',
      diagnosisCode: 'E11.9',
      notes: 'Patient reports increased thirst and frequent urination. Blood glucose levels elevated.',
      status: 'COMPLETED',
      vitalSigns: {
        temperature: 98.6,
        bloodPressure: '130/85',
        heartRate: 78,
        respiratoryRate: 16,
        spo2: 98,
        weight: 75,
        height: 170,
      },
    },
  });

  console.log('Encounters created:', { encounter1 });

  // Create sample lab result
  const lab1 = await prisma.labResult.create({
    data: {
      patientId: patient1.id,
      encounterId: encounter1.id,
      testName: 'HbA1c',
      testCategory: 'Blood Test',
      orderedDate: new Date('2024-02-01'),
      reportDate: new Date('2024-02-02'),
      status: 'COMPLETED',
      results: '8.5',
      normalRange: '4.0-5.6',
      unit: '%',
      remarks: 'Elevated, indicates poor glycemic control',
      orderedById: doctor.id,
    },
  });

  console.log('Lab results created:', { lab1 });

  // Create sample prescription
  const prescription1 = await prisma.prescription.create({
    data: {
      patientId: patient1.id,
      encounterId: encounter1.id,
      doctorId: doctor.id,
      date: new Date('2024-02-01'),
      medications: [
        {
          name: 'Metformin',
          dosage: '500mg',
          frequency: 'Twice daily',
          duration: '30 days',
          route: 'Oral',
          instructions: 'Take after meals',
        },
      ],
      instructions: 'Follow diet plan and exercise regularly',
      status: 'ACTIVE',
    },
  });

  console.log('Prescriptions created:', { prescription1 });

  // Create sample bill
  const bill1 = await prisma.bill.create({
    data: {
      patientId: patient1.id,
      encounterId: encounter1.id,
      date: new Date('2024-02-01'),
      items: [
        { name: 'Consultation Fee', quantity: 1, rate: 500, amount: 500 },
        { name: 'HbA1c Test', quantity: 1, rate: 800, amount: 800 },
      ],
      subtotal: 1300,
      tax: 234,
      discount: 0,
      total: 1534,
      paymentMethod: 'UPI',
      paymentStatus: 'PAID',
      notes: 'Payment received via UPI',
    },
  });

  console.log('Bills created:', { bill1 });

  console.log('Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
