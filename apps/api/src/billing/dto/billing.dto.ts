import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { BillingInterval } from "@prisma/client";
import {
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from "class-validator";

export class SubscriptionPlanDto {
  @ApiProperty()
  @IsString()
  @MaxLength(80)
  key!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(120)
  name!: string;

  @ApiProperty({ enum: BillingInterval })
  @IsEnum(BillingInterval)
  interval!: BillingInterval;

  @ApiProperty()
  @IsInt()
  @Min(0)
  priceCents!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(40)
  currency?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  stripePriceId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  features?: Record<string, unknown>;
}

export class CreateCheckoutSessionDto {
  @ApiProperty()
  @IsUUID()
  companyId!: string;

  @ApiProperty()
  @IsUUID()
  planId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(40)
  gstNumber?: string;
}

export class CouponDto {
  @ApiProperty()
  @IsString()
  @MaxLength(40)
  code!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  percentOff?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  amountOffCents?: number;
}
