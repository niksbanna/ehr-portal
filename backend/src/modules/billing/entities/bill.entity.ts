import { Bill as PrismaBill, PaymentMethod, PaymentStatus } from '@prisma/client';

export class BillEntity implements PrismaBill {
  id: string;
  patientId: string;
  encounterId: string | null;
  date: Date;
  items: any;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}
