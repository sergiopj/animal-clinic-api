import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';

import { UserRole } from '../../shared/auth/auth.types.js';
import { Roles } from '../../shared/auth/roles.decorator.js';

import type { IClinic } from './clinic.entity.js';
import { ClinicService } from './clinic.service.js';
import { ClinicQueryParams } from './dto/Request/query-clinic.dto.js';
import { ClinicIdParamDTO, RequestClinicDTO } from './dto/Request/request-clinic.dto.js';

@ApiTags('Clinics')
@Roles(UserRole.PLATFORM_ADMIN)
@Controller('clinics')
export class ClinicController {
  constructor(private readonly clinicService: ClinicService) {}

  @Get()
  @ApiOperation({ summary: 'Get clinics with pagination and filters' })
  getClinics(@Query() query: ClinicQueryParams) {
    return this.clinicService.getClinics(query);
  }

  @Get(':id')
  async getClinicById(@Param() params: ClinicIdParamDTO) {
    const clinic = await this.clinicService.getClinicById(params.id);
    if (!clinic) throw new NotFoundException('Clinic not found');
    return clinic;
  }

  @Post()
  createClinic(@Body() clinicData: RequestClinicDTO) {
    return this.clinicService.addClinic(clinicData as unknown as Partial<IClinic>);
  }

  @Put(':id')
  async updateClinic(@Param() params: ClinicIdParamDTO, @Body() clinicData: RequestClinicDTO) {
    const clinic = await this.clinicService.updateClinic(
      params.id,
      clinicData as unknown as Partial<IClinic>
    );
    if (!clinic) throw new NotFoundException('Clinic not found');
    return clinic;
  }

  @Delete(':id')
  async deleteClinic(@Param() params: ClinicIdParamDTO) {
    const clinic = await this.clinicService.deleteClinic(params.id);
    if (!clinic) throw new NotFoundException('Clinic not found');
    return clinic;
  }

  @Get('report/:id')
  @ApiOperation({ summary: 'Download a clinic PDF report' })
  async getClinicReport(
    @Param() params: ClinicIdParamDTO,
    @Res() response: Response
  ): Promise<void> {
    const pdfBuffer = await this.clinicService.generateClinicReport(params.id);
    if (!pdfBuffer) throw new NotFoundException('Clinic not found');

    response
      .setHeader('Content-Type', 'application/pdf')
      .setHeader('Content-Disposition', `attachment; filename=clinic_${params.id}_report.pdf`)
      .status(200)
      .send(pdfBuffer);
  }
}
