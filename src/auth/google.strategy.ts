import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);
  constructor(private readonly config: ConfigService) {
    const clientID = config.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = config.get<string>('GOOGLE_CLIENT_SECRET');
    const backendUrl = config.get<string>('BACKEND_URL') || 'http://localhost:3001';
    const normalizedBackendUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
    const callbackURL =
      config.get<string>('GOOGLE_CALLBACK_URL') || `${normalizedBackendUrl}/auth/google/callback`;

    // Call super first (required) with values or empty strings — we'll warn after if missing
    super({
      clientID: clientID || '',
      clientSecret: clientSecret || '',
      callbackURL,
      scope: ['email', 'profile'],
    });

    if (!clientID || !clientSecret) {
      this.logger.warn('GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not set — Google auth will be disabled until configured');
    }
  }

  // Called after successful authentication with Google
  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
    // Keep minimal user object that will be available on req.user
    const user = {
      email: profile?.emails?.[0]?.value,
      displayName: profile?.displayName,
      profile,
    };
    done(null, user);
  }
}
