import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CodeableConceptDto, ReferenceDto } from '../../encounters/dto/encounter-response.dto';

/**
 * FHIR-inspired Money type
 */
export class MoneyDto {
  @ApiProperty({ description: 'Numerical value (with implicit precision)' })
  value: number;

  @ApiProperty({ description: 'ISO 4217 Currency Code' })
  currency: string;
}

/**
 * Line item in the invoice
 */
export class InvoiceLineItemDto {
  @ApiPropertyOptional({ description: 'Sequence number of line item' })
  sequence?: number;

  @ApiProperty({ description: 'Billing code or service/product' })
  chargeItemCodeableConcept: CodeableConceptDto;

  @ApiPropertyOptional({ description: 'Reference to encounter or other resource' })
  chargeItemReference?: ReferenceDto;

  @ApiPropertyOptional({ description: 'Unit price', type: MoneyDto })
  priceComponent?: {
    type: 'base' | 'surcharge' | 'deduction' | 'discount' | 'tax';
    code?: CodeableConceptDto;
    factor?: number;
    amount: MoneyDto;
  }[];

  @ApiProperty({ description: 'Total price for item', type: MoneyDto })
  net: MoneyDto;
}

/**
 * Response DTO for Bill/Invoice resource (FHIR-inspired)
 */
export class BillResponseDto {
  @ApiProperty({ description: 'Resource type' })
  resourceType: 'Invoice';

  @ApiProperty({ description: 'Invoice ID' })
  id: string;

  @ApiPropertyOptional({ description: 'Business identifier' })
  identifier?: string;

  @ApiProperty({ description: 'Invoice status', enum: ['PENDING', 'PAID', 'CANCELLED'] })
  status: string;

  @ApiPropertyOptional({ description: 'Type of invoice' })
  type?: CodeableConceptDto;

  @ApiProperty({ description: 'Patient reference', type: ReferenceDto })
  subject: ReferenceDto;

  @ApiPropertyOptional({ description: 'Encounter reference', type: ReferenceDto })
  encounter?: ReferenceDto;

  @ApiProperty({ description: 'Invoice date' })
  date: string;

  @ApiPropertyOptional({ description: 'Line items', type: [InvoiceLineItemDto] })
  lineItem?: InvoiceLineItemDto[];

  @ApiPropertyOptional({ description: 'Components of total line items', type: MoneyDto })
  totalPriceComponent?: {
    type: 'base' | 'surcharge' | 'deduction' | 'discount' | 'tax';
    code?: CodeableConceptDto;
    amount: MoneyDto;
  }[];

  @ApiProperty({ description: 'Subtotal amount before tax and discount', type: MoneyDto })
  subtotal: MoneyDto;

  @ApiProperty({ description: 'Tax amount', type: MoneyDto })
  tax: MoneyDto;

  @ApiPropertyOptional({ description: 'Discount amount', type: MoneyDto })
  discount?: MoneyDto;

  @ApiProperty({ description: 'Total invoice amount', type: MoneyDto })
  totalNet: MoneyDto;

  @ApiPropertyOptional({ description: 'Payment method' })
  paymentMethod?: CodeableConceptDto;

  @ApiPropertyOptional({ description: 'Notes or comments' })
  note?: string;

  @ApiPropertyOptional({ description: 'Creation timestamp' })
  createdAt?: Date;

  @ApiPropertyOptional({ description: 'Last update timestamp' })
  updatedAt?: Date;
}
