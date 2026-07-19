import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator";

export class CreatePayrollRecordDto {
  @ApiProperty()
  @IsUUID()
  placementId!: string;

  @ApiProperty()
  @IsDateString()
  payPeriodStart!: string;

  @ApiProperty()
  @IsDateString()
  payPeriodEnd!: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  baseEarnings!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  overtimeEarnings?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalDeductions?: number;
}

export class CreateClientInvoiceDto {
  @ApiProperty()
  @IsUUID()
  companyId!: string;

  @ApiProperty()
  @IsString()
  invoiceNumber!: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  amount!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  taxAmount?: number;

  @ApiProperty()
  @IsDateString()
  dueDate!: string;
}

export class RecordCommissionDto {
  @ApiProperty()
  @IsUUID()
  recruiterId!: string;

  @ApiProperty()
  @IsUUID()
  placementId!: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  amount!: number;
}
