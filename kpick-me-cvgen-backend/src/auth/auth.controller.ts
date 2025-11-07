import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Redirects to Google for authentication
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Guard will redirect
  }

  // Google OAuth callback route
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: any) {
    // req.user is set by GoogleStrategy.validate()
    const user = await this.authService.findOrCreateUser(req.user);
    const token = await this.authService.getJwtToken(user);
    return { access_token: token };
  }
}
