import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import {
  CreateClientInvoiceDto,
  CreatePayrollRecordDto,
  RecordCommissionDto,
} from "./dto/finance.dto";
import { FinanceService } from "./finance.service";

@ApiTags("Finance & Payroll")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.RECRUITER)
@Controller("finance")
export class FinanceController {
  constructor(private readonly finance: FinanceService) {}

  @Post("payroll")
  createPayrollRecord(@Body() dto: CreatePayrollRecordDto) {
    return this.finance.createPayrollRecord(dto);
  }

  @Post("invoices")
  createClientInvoice(@Body() dto: CreateClientInvoiceDto) {
    return this.finance.createClientInvoice(dto);
  }

  @Get("invoices")
  getClientInvoices(@Query("companyId") companyId?: string) {
    return this.finance.getClientInvoices(companyId);
  }

  @Post("commissions")
  recordCommission(@Body() dto: RecordCommissionDto) {
    return this.finance.recordCommission(dto);
  }
}
