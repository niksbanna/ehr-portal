import { BillEntity } from '../entities/bill.entity';
import { BillResponseDto, MoneyDto, InvoiceLineItemDto } from '../dto/bill-response.dto';
import { CodeableConceptDto, ReferenceDto } from '../../encounters/dto/encounter-response.dto';

/**
 * Transforms a Bill entity to FHIR-inspired Invoice response DTO
 */
export class BillMapper {
  static toResponseDto(bill: any): BillResponseDto {
    const subject: ReferenceDto = {
      reference: `Patient/${bill.patientId}`,
      type: 'Patient',
      display: bill.patient ? `${bill.patient.firstName} ${bill.patient.lastName}` : undefined,
    };

    const encounter: ReferenceDto | undefined = bill.encounterId
      ? {
          reference: `Encounter/${bill.encounterId}`,
          type: 'Encounter',
        }
      : undefined;

    const currency = bill.currency || 'INR';

    const subtotal: MoneyDto = {
      value: bill.subtotal,
      currency,
    };

    const tax: MoneyDto = {
      value: bill.tax,
      currency,
    };

    const discount: MoneyDto | undefined = bill.discount
      ? {
          value: bill.discount,
          currency,
        }
      : undefined;

    const totalNet: MoneyDto = {
      value: bill.total,
      currency,
    };

    // Parse line items if stored as JSON
    let lineItems: InvoiceLineItemDto[] | undefined;
    if (bill.items && typeof bill.items === 'object') {
      const itemsArray = Array.isArray(bill.items) ? bill.items : [bill.items];
      lineItems = itemsArray.map((item: any, index: number) => ({
        sequence: index + 1,
        chargeItemCodeableConcept: {
          text: item.name || item.description || 'Service',
        },
        net: {
          value: item.amount || item.price || 0,
          currency,
        },
      }));
    }

    const paymentMethod: CodeableConceptDto | undefined = {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/payment-type',
          code: bill.paymentMethod,
          display: bill.paymentMethod,
        },
      ],
      text: bill.paymentMethod,
    };

    const typeCode: CodeableConceptDto = {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/invoice-type',
          code: 'invoice',
          display: 'Invoice',
        },
      ],
      text: 'Medical Invoice',
    };

    return {
      resourceType: 'Invoice',
      id: bill.id,
      status: bill.paymentStatus,
      type: typeCode,
      subject,
      encounter,
      date: bill.date.toISOString().split('T')[0],
      lineItem: lineItems,
      subtotal,
      tax,
      discount,
      totalNet,
      paymentMethod,
      note: bill.notes,
      createdAt: bill.createdAt,
      updatedAt: bill.updatedAt,
    };
  }

  static toResponseDtoArray(bills: any[]): BillResponseDto[] {
    return bills.map((bill) => this.toResponseDto(bill));
  }
}
