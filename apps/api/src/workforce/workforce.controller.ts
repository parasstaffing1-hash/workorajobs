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
  ClockInOutDto,
  CreateAssignmentDto,
  CreatePlacementDto,
  FileExpenseDto,
  RequestLeaveDto,
  SubmitComplianceDto,
  SubmitTimesheetDto,
} from "./dto/workforce.dto";
import { WorkforceService } from "./workforce.service";

@ApiTags("Workforce Management")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.RECRUITER)
@Controller("workforce")
export class WorkforceController {
  constructor(private readonly workforce: WorkforceService) {}

  @Post("placements")
  createPlacement(@Body() dto: CreatePlacementDto) {
    return this.workforce.createPlacement(dto);
  }

  @Get("placements")
  getPlacements(@Query("companyId") companyId?: string) {
    return this.workforce.getPlacements(companyId);
  }

  @Post("assignments")
  createAssignment(@Body() dto: CreateAssignmentDto) {
    return this.workforce.createAssignment(dto);
  }

  @Post("timesheets")
  submitTimesheet(@Body() dto: SubmitTimesheetDto) {
    return this.workforce.submitTimesheet(dto);
  }

  @Post("attendance/clock")
  clockInOut(@Body() dto: ClockInOutDto) {
    return this.workforce.clockInOut(dto);
  }

  @Post("leaves")
  requestLeave(@Body() dto: RequestLeaveDto) {
    return this.workforce.requestLeave(dto);
  }

  @Post("expenses")
  fileExpense(@Body() dto: FileExpenseDto) {
    return this.workforce.fileExpense(dto);
  }

  @Post("compliance")
  submitCompliance(@Body() dto: SubmitComplianceDto) {
    return this.workforce.submitCompliance(dto);
  }
}
