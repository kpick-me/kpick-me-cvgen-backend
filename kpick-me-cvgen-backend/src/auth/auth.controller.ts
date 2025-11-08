import {
  Controller,
  Get,
  NotFoundException,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  // Redirects to Google for authentication
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Guard will redirect
  }

  // Google OAuth callback route
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: any, @Res() res: Response) {
    // req.user is set by GoogleStrategy.validate()
    const user = await this.authService.findOrCreateUser(req.user);
    const token = await this.authService.getJwtToken(user);
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const normalizedUrl = frontendUrl.endsWith('/') ? frontendUrl.slice(0, -1) : frontendUrl;

    return res.redirect(`${normalizedUrl}/auth/success?token=${token}`);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getCurrentUser(@Req() req: any) {
    const user = await this.authService.getUserProfile(req.user.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
