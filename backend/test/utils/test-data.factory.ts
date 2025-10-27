import { faker } from '@faker-js/faker';
import {
  Gender,
  UserRole,
  EncounterType,
  EncounterStatus,
  PaymentMethod,
  PaymentStatus,
} from '@prisma/client';

export class TestDataFactory {
  static createPatientData(overrides = {}) {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      dateOfBirth: faker.date.past({ years: 50 }).toISOString().split('T')[0],
      gender: faker.helpers.arrayElement([Gender.MALE, Gender.FEMALE, Gender.OTHER]),
      phone: `+91${faker.string.numeric(10)}`,
      email: faker.internet.email(),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      pincode: faker.string.numeric(6),
      emergencyContact: faker.person.fullName(),
      emergencyPhone: `+91${faker.string.numeric(10)}`,
      bloodGroup: faker.helpers.arrayElement(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']),
      allergies: faker.lorem.sentence(),
      medicalHistory: faker.lorem.paragraph(),
      registrationDate: faker.date.recent().toISOString().split('T')[0],
      ...overrides,
    };
  }

  static createUserData(overrides = {}) {
    return {
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.person.fullName(),
      role: faker.helpers.arrayElement([
        UserRole.ADMIN,
        UserRole.DOCTOR,
        UserRole.NURSE,
        UserRole.LAB_TECH,
      ]),
      ...overrides,
    };
  }

  static createEncounterData(patientId: string, doctorId: string, overrides = {}) {
    return {
      patientId,
      doctorId,
      date: faker.date.recent().toISOString(),
      type: faker.helpers.arrayElement([
        EncounterType.CONSULTATION,
        EncounterType.FOLLOWUP,
        EncounterType.EMERGENCY,
      ]),
      chiefComplaint: faker.lorem.sentence(),
      diagnosis: faker.lorem.sentence(),
      diagnosisCode: faker.string.alphanumeric(6).toUpperCase(),
      notes: faker.lorem.paragraph(),
      status: faker.helpers.arrayElement([
        EncounterStatus.SCHEDULED,
        EncounterStatus.IN_PROGRESS,
        EncounterStatus.COMPLETED,
      ]),
      vitalSigns: {
        temperature: faker.number.float({ min: 36.0, max: 39.0, fractionDigits: 1 }),
        bloodPressure: `${faker.number.int({ min: 110, max: 140 })}/${faker.number.int({ min: 70, max: 90 })}`,
        pulse: faker.number.int({ min: 60, max: 100 }),
        respiratoryRate: faker.number.int({ min: 12, max: 20 }),
      },
      ...overrides,
    };
  }

  static createBillData(patientId: string, encounterId: string, overrides = {}) {
    const items = [
      {
        name: faker.commerce.productName(),
        quantity: faker.number.int({ min: 1, max: 5 }),
        rate: faker.number.float({ min: 100, max: 5000, fractionDigits: 2 }),
      },
    ];
    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
    const tax = subtotal * 0.18; // 18% GST
    const discount = 0;
    const total = subtotal + tax - discount;

    return {
      patientId,
      encounterId,
      date: faker.date.recent().toISOString(),
      items,
      subtotal,
      tax,
      discount,
      total,
      currency: 'INR',
      paymentMethod: faker.helpers.arrayElement([
        PaymentMethod.CASH,
        PaymentMethod.CARD,
        PaymentMethod.UPI,
        PaymentMethod.NET_BANKING,
      ]),
      paymentStatus: faker.helpers.arrayElement([PaymentStatus.PENDING, PaymentStatus.PAID]),
      notes: faker.lorem.sentence(),
      ...overrides,
    };
  }

  static createLoginDto(overrides = {}) {
    return {
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...overrides,
    };
  }

  static createRegisterDto(overrides = {}) {
    return {
      email: faker.internet.email(),
      password: faker.internet.password({ length: 12 }),
      name: faker.person.fullName(),
      role: UserRole.DOCTOR,
      ...overrides,
    };
  }
}
