import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
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

import type { AuthenticatedUser } from '../../shared/auth/auth.types.js';
import { UserRole } from '../../shared/auth/auth.types.js';
import { CurrentUser } from '../../shared/auth/current-user.decorator.js';
import { Roles } from '../../shared/auth/roles.decorator.js';
import {
  MedicalReportIdParamDTO,
  RequestMedicalReportDTO,
} from '../medical-report/dto/Request/request-medical-report.dto.js';

import { PetQueryParams } from './dto/Request/query-pet.dto.js';
import { PetIdParamDTO, RequestPetDTO } from './dto/Request/request-pet.dto.js';
import type { IPet } from './pet.entity.js';
import { PetService } from './pet.service.js';

@ApiTags('Pets')
@Controller('pets')
export class PetController {
  constructor(private readonly petService: PetService) {}

  private clinicScope(user: AuthenticatedUser): string | undefined {
    if (user.role === UserRole.PLATFORM_ADMIN) return undefined;
    if (!user.clinicId) throw new ForbiddenException('User is not assigned to a clinic');
    return user.clinicId;
  }

  @Get()
  @Roles(UserRole.PLATFORM_ADMIN, UserRole.CLINIC_ADMIN, UserRole.CLINIC_USER)
  @ApiOperation({ summary: 'Get pets with pagination and filters' })
  getPets(@Query() query: PetQueryParams, @CurrentUser() user: AuthenticatedUser) {
    return this.petService.getPets(query, this.clinicScope(user));
  }

  @Get('report/:id')
  @Roles(UserRole.PLATFORM_ADMIN, UserRole.CLINIC_ADMIN, UserRole.CLINIC_USER)
  @ApiOperation({ summary: 'Download a pet clinical history PDF' })
  async getPetReport(
    @Param() params: PetIdParamDTO,
    @Res() response: Response,
    @CurrentUser() user: AuthenticatedUser
  ): Promise<void> {
    const pdfBuffer = await this.petService.generateClinicalHistoryReport(
      params.id,
      this.clinicScope(user)
    );
    if (!pdfBuffer) throw new NotFoundException('Pet not found');

    response
      .setHeader('Content-Type', 'application/pdf')
      .setHeader('Content-Disposition', `attachment; filename=pet_${params.id}_report.pdf`)
      .status(200)
      .send(pdfBuffer);
  }

  @Post(':id/care-report')
  @Roles(UserRole.PLATFORM_ADMIN, UserRole.CLINIC_ADMIN, UserRole.CLINIC_USER)
  @ApiOperation({ summary: 'Generate and download an AI-assisted pet care report PDF' })
  async getPetCareReport(
    @Param() params: PetIdParamDTO,
    @Res() response: Response,
    @CurrentUser() user: AuthenticatedUser
  ): Promise<void> {
    const pdfBuffer = await this.petService.generateCareReport(params.id, this.clinicScope(user));
    if (!pdfBuffer) throw new NotFoundException('Pet not found');

    response
      .setHeader('Content-Type', 'application/pdf')
      .setHeader('Content-Disposition', `attachment; filename=pet_${params.id}_care_report.pdf`)
      .status(200)
      .send(pdfBuffer);
  }

  @Get(':id/medical-reports')
  @Roles(UserRole.PLATFORM_ADMIN, UserRole.CLINIC_ADMIN, UserRole.CLINIC_USER)
  @ApiOperation({ summary: 'List a pet clinical records' })
  async getMedicalReports(@Param() params: PetIdParamDTO, @CurrentUser() user: AuthenticatedUser) {
    const reports = await this.petService.getMedicalReports(params.id, this.clinicScope(user));
    if (!reports) throw new NotFoundException('Pet not found');
    return reports;
  }

  @Post(':id/medical-reports')
  @Roles(UserRole.PLATFORM_ADMIN, UserRole.CLINIC_ADMIN)
  @ApiOperation({ summary: 'Add a clinical record to a pet' })
  async createMedicalReport(
    @Param() params: PetIdParamDTO,
    @Body() data: RequestMedicalReportDTO,
    @CurrentUser() user: AuthenticatedUser
  ) {
    const report = await this.petService.createMedicalReport(
      params.id,
      {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
      },
      this.clinicScope(user)
    );
    if (!report) throw new NotFoundException('Pet not found');
    return report;
  }

  @Put(':id/medical-reports/:reportId')
  @Roles(UserRole.PLATFORM_ADMIN, UserRole.CLINIC_ADMIN)
  @ApiOperation({ summary: 'Update a pet clinical record' })
  async updateMedicalReport(
    @Param() params: MedicalReportIdParamDTO,
    @Body() data: RequestMedicalReportDTO,
    @CurrentUser() user: AuthenticatedUser
  ) {
    const report = await this.petService.updateMedicalReport(
      params.id,
      params.reportId,
      {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
      },
      this.clinicScope(user)
    );
    if (!report) throw new NotFoundException('Pet or clinical record not found');
    return report;
  }

  @Delete(':id/medical-reports/:reportId')
  @Roles(UserRole.PLATFORM_ADMIN, UserRole.CLINIC_ADMIN)
  @ApiOperation({ summary: 'Delete a pet clinical record' })
  async deleteMedicalReport(
    @Param() params: MedicalReportIdParamDTO,
    @CurrentUser() user: AuthenticatedUser
  ) {
    const report = await this.petService.deleteMedicalReport(
      params.id,
      params.reportId,
      this.clinicScope(user)
    );
    if (!report) throw new NotFoundException('Pet or clinical record not found');
    return report;
  }

  @Get(':id')
  @Roles(UserRole.PLATFORM_ADMIN, UserRole.CLINIC_ADMIN, UserRole.CLINIC_USER)
  async getPetById(@Param() params: PetIdParamDTO, @CurrentUser() user: AuthenticatedUser) {
    const pet = await this.petService.getPetById(params.id, this.clinicScope(user));
    if (!pet) throw new NotFoundException('Pet not found');
    return pet;
  }

  @Post()
  @Roles(UserRole.PLATFORM_ADMIN, UserRole.CLINIC_ADMIN)
  createPet(@Body() petData: RequestPetDTO, @CurrentUser() user: AuthenticatedUser) {
    return this.petService.addPet(petData as unknown as IPet, this.clinicScope(user));
  }

  @Put(':id')
  @Roles(UserRole.PLATFORM_ADMIN, UserRole.CLINIC_ADMIN)
  async updatePet(
    @Param() params: PetIdParamDTO,
    @Body() petData: RequestPetDTO,
    @CurrentUser() user: AuthenticatedUser
  ) {
    const pet = await this.petService.updatePet(
      params.id,
      petData as unknown as IPet,
      this.clinicScope(user)
    );
    if (!pet) throw new NotFoundException('Pet not found');
    return pet;
  }

  @Delete(':id')
  @Roles(UserRole.PLATFORM_ADMIN, UserRole.CLINIC_ADMIN)
  async deletePet(@Param() params: PetIdParamDTO, @CurrentUser() user: AuthenticatedUser) {
    const pet = await this.petService.deletePet(params.id, this.clinicScope(user));
    if (!pet) throw new NotFoundException('Pet not found');
    return pet;
  }
}
