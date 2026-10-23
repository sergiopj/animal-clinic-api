import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { UserRole } from '../../shared/auth/auth.types.js';
import { Public } from '../../shared/auth/public.decorator.js';
import { Roles } from '../../shared/auth/roles.decorator.js';

import { AuthService } from './auth.service.js';
import { CreateClinicUserDTO } from './dto/create-clinic-user.dto.js';
import { LoginDTO } from './dto/login.dto.js';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Exchange email and password for a short-lived access token' })
  login(@Body() credentials: LoginDTO) {
    return this.authService.login(credentials.email, credentials.password);
  }

  @Roles(UserRole.PLATFORM_ADMIN)
  @Post('users')
  @ApiOperation({ summary: 'Create a clinic-scoped account; platform admin only' })
  createClinicUser(@Body() input: CreateClinicUserDTO) {
    return this.authService.createClinicUser(input);
  }
}
