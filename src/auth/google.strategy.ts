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
    const callbackURL = config.get<string>('GOOGLE_CALLBACK_URL') || `${normalizedBackendUrl}/auth/google/callback`;

    // Call super first (required) with values or empty strings — we'll warn after if missing
    super({
      clientID: clientID || '',
      clientSecret: clientSecret || '',
      callbackURL,
      scope: ['email', 'profile'],
    });

    // Helpful logs for debugging production vs local callback URL issues
    this.logger.log(`Google OAuth callback URL: ${callbackURL}`);
    if (!clientID || !clientSecret) {
      this.logger.warn('GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not set — Google auth will be disabled until configured');
    }
    // If callback is localhost but we're running in production, warn loudly — this is a common misconfiguration
    const nodeEnv = config.get<string>('NODE_ENV') || process.env.NODE_ENV;
    if (nodeEnv === 'production' && callbackURL.includes('localhost')) {
      this.logger.warn(
        `Google OAuth callback URL appears to be localhost while NODE_ENV=production. Set GOOGLE_CALLBACK_URL or BACKEND_URL to the deployed backend URL (e.g. https://kpick-me-back.up.railway.app)`,
      );
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
