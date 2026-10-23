import { Controller, Get } from '@nestjs/common';

import { Public } from '../../shared/auth/public.decorator.js';

@Controller()
export class HealthController {
  @Public()
  @Get('health')
  getHealth() {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
