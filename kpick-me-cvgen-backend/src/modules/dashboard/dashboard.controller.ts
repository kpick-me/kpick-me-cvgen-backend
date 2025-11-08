import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(AuthGuard('jwt'))
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get()
  async getDashboard(@Req() req) {
    return this.dashboardService.getUserDashboard(req.user.id);
  }

  @Get('stats')
  async getStats(@Req() req) {
    return this.dashboardService.getUserStats(req.user.id);
  }
}

