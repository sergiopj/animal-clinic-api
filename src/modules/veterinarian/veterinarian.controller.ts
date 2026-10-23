import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { UserRole } from '../../shared/auth/auth.types.js';
import { Roles } from '../../shared/auth/roles.decorator.js';

import { RequestVeterinarianDTO, VeterinarianIdParamDTO } from './dto/request-veterinarian.dto.js';
import type { VeterinarianWriteModel } from './veterinarian.model.js';
import { VeterinarianService } from './veterinarian.service.js';

@ApiTags('Veterinarians')
@Roles(UserRole.PLATFORM_ADMIN)
@Controller('veterinarians')
export class VeterinarianController {
  constructor(private readonly veterinarianService: VeterinarianService) {}

  @Get()
  @ApiOperation({ summary: 'List veterinarians' })
  getVeterinarians() {
    return this.veterinarianService.getVeterinarians();
  }

  @Post()
  @ApiOperation({ summary: 'Create a veterinarian' })
  createVeterinarian(@Body() data: RequestVeterinarianDTO) {
    return this.veterinarianService.addVeterinarian(data as VeterinarianWriteModel);
  }

  @Get(':id')
  async getVeterinarianById(@Param() params: VeterinarianIdParamDTO) {
    const veterinarian = await this.veterinarianService.getVeterinarianById(params.id);
    if (!veterinarian) throw new NotFoundException('Veterinarian not found');
    return veterinarian;
  }

  @Put(':id')
  async updateVeterinarian(
    @Param() params: VeterinarianIdParamDTO,
    @Body() data: RequestVeterinarianDTO
  ) {
    const veterinarian = await this.veterinarianService.updateVeterinarian(
      params.id,
      data as VeterinarianWriteModel
    );
    if (!veterinarian) throw new NotFoundException('Veterinarian not found');
    return veterinarian;
  }

  @Delete(':id')
  async deleteVeterinarian(@Param() params: VeterinarianIdParamDTO) {
    const veterinarian = await this.veterinarianService.deleteVeterinarian(params.id);
    if (!veterinarian) throw new NotFoundException('Veterinarian not found');
    return veterinarian;
  }
}
