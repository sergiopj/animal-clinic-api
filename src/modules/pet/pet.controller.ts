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
