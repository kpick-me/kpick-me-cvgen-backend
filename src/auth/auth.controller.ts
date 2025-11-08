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

    // Prefer explicit FRONTEND_URL env var, but if missing try to derive the URL
    // from request headers (useful when behind proxies like Railway / Vercel).
    // Order of precedence:
    // 1. FRONTEND_URL env var
    // 2. X-Forwarded-Proto + X-Forwarded-Host headers
    // 3. Origin header
    // 4. req.protocol + req.get('host')
    let frontendUrl = this.configService.get<string>('FRONTEND_URL');
    if (!frontendUrl) {
      const forwardedProto = (req.headers['x-forwarded-proto'] as string) || '';
      const forwardedHost = (req.headers['x-forwarded-host'] as string) || (req.headers['x-forwarded-server'] as string) || '';
      if (forwardedProto && forwardedHost) {
        // x-forwarded-proto may contain a comma-separated list
        const proto = forwardedProto.split(',')[0].trim();
        const host = forwardedHost.split(',')[0].trim();
        frontendUrl = `${proto}://${host}`;
      } else if (req.headers.origin) {
        frontendUrl = req.headers.origin as string;
      } else {
        frontendUrl = `${req.protocol}://${req.get('host')}`;
      }
    }

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
