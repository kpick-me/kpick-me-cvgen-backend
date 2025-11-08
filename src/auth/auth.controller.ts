import {
  Controller,
  Get,
  NotFoundException,
  Req,
  Res,
  UseGuards,
  Logger,
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

  private readonly logger = new Logger(AuthController.name);

  // Redirects to Google for authentication
  @Get('google')
  async googleAuth(@Req() req: any, @Res() res: Response) {
    // Build a redirect to Google's OAuth 2.0 endpoint with a redirect_uri that matches
    // the current backend origin (derived from BACKEND_URL env or forwarded headers).
    const clientID = this.configService.get<string>('GOOGLE_CLIENT_ID');
    if (!clientID) {
      return res.status(500).send('Google client ID not configured');
    }

    // Derive backend origin (where Google should redirect back to)
    let backendOrigin = this.configService.get<string>('BACKEND_URL');
    if (!backendOrigin) {
      const forwardedProto = (req.headers['x-forwarded-proto'] as string) || '';
      const forwardedHost = (req.headers['x-forwarded-host'] as string) || (req.headers['x-forwarded-server'] as string) || '';
      if (forwardedProto && forwardedHost) {
        const proto = forwardedProto.split(',')[0].trim();
        const host = forwardedHost.split(',')[0].trim();
        backendOrigin = `${proto}://${host}`;
      } else if (req.headers.origin) {
        backendOrigin = req.headers.origin as string;
      } else {
        backendOrigin = `${req.protocol}://${req.get('host')}`;
      }
    }

    const normalizedBackend = backendOrigin.endsWith('/') ? backendOrigin.slice(0, -1) : backendOrigin;
    const redirectUri = `${normalizedBackend}/auth/google/callback`;

    const scope = encodeURIComponent('openid email profile');
    const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${encodeURIComponent(
      clientID,
    )}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&access_type=offline&prompt=consent`;

    return res.redirect(url);
  }

  // Google OAuth callback route
  @Get('google/callback')
  async googleAuthCallback(@Req() req: any, @Res() res: Response) {
    // If passport set req.user (e.g., local dev with strategy), prefer that.
    if (req.user) {
      const user = await this.authService.findOrCreateUser(req.user);
      const token = await this.authService.getJwtToken(user);
      return this.redirectToFrontend(req, res, token);
    }

    // Otherwise, perform manual code exchange (dynamic redirect_uri) so we can
    // accept callbacks on whatever public hostname Google used when initiating auth.
    const code = req.query?.code as string | undefined;
    if (!code) {
      return res.status(400).send('Missing authorization code');
    }

    const clientID = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET');
    if (!clientID || !clientSecret) {
      this.logger.warn('Google client ID/secret missing during callback');
      return res.status(500).send('Google OAuth not configured');
    }

    // Derive backend origin used as redirect_uri (should match what we used when redirecting to Google)
    let backendOrigin = this.configService.get<string>('BACKEND_URL');
    if (!backendOrigin) {
      const forwardedProto = (req.headers['x-forwarded-proto'] as string) || '';
      const forwardedHost = (req.headers['x-forwarded-host'] as string) || (req.headers['x-forwarded-server'] as string) || '';
      if (forwardedProto && forwardedHost) {
        const proto = forwardedProto.split(',')[0].trim();
        const host = forwardedHost.split(',')[0].trim();
        backendOrigin = `${proto}://${host}`;
      } else if (req.headers.origin) {
        backendOrigin = req.headers.origin as string;
      } else {
        backendOrigin = `${req.protocol}://${req.get('host')}`;
      }
    }

    const normalizedBackend = backendOrigin.endsWith('/') ? backendOrigin.slice(0, -1) : backendOrigin;
    const redirectUri = `${normalizedBackend}/auth/google/callback`;

    try {
      const params = new URLSearchParams();
      params.append('code', code);
      params.append('client_id', clientID);
      params.append('client_secret', clientSecret);
      params.append('redirect_uri', redirectUri);
      params.append('grant_type', 'authorization_code');

      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });

      if (!tokenRes.ok) {
        const errText = await tokenRes.text();
        this.logger.warn(`Google token exchange failed: ${errText}`);
        return res.status(500).send('Google token exchange failed');
      }

      const tokenJson = await tokenRes.json();
      const accessToken = tokenJson.access_token as string | undefined;
      const idToken = tokenJson.id_token as string | undefined;

      // Fetch userinfo
      let profile: any = null;
      if (accessToken) {
        const uiRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (uiRes.ok) {
          profile = await uiRes.json();
        }
      }

      // Fallback: try to decode id_token if userinfo not available
      if (!profile && idToken) {
        // idToken is a JWT; payload is the 2nd segment
        const parts = idToken.split('.');
        if (parts.length >= 2) {
          try {
            const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
            profile = payload;
          } catch (e) {
            // ignore
          }
        }
      }

      if (!profile) {
        this.logger.warn('Could not obtain user profile from Google after token exchange');
        return res.status(500).send('Failed to fetch user info from Google');
      }

      const oauthUser = {
        email: profile.email,
        displayName: profile.name || profile.displayName,
        profile,
        id: profile.sub || profile.id,
      };

      const user = await this.authService.findOrCreateUser(oauthUser);
      const jwt = await this.authService.getJwtToken(user);
      return this.redirectToFrontend(req, res, jwt);
    } catch (err: any) {
      this.logger.error('Error handling Google callback', err?.stack || err?.message || err);
      return res.status(500).send('Internal error handling OAuth callback');
    }
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

  // Helper to build frontend redirect and send the JWT token there
  private redirectToFrontend(req: any, res: Response, token: string) {
    // Prefer FRONTEND_URL env, then forwarded headers, then origin, then host
    let frontendUrl = this.configService.get<string>('FRONTEND_URL');
    if (!frontendUrl) {
      const forwardedProto = (req.headers['x-forwarded-proto'] as string) || '';
      const forwardedHost = (req.headers['x-forwarded-host'] as string) || (req.headers['x-forwarded-server'] as string) || '';
      if (forwardedProto && forwardedHost) {
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

    // Ensure absolute origin
    let redirectBase = normalizedUrl;
    try {
      const u = new URL(redirectBase);
      redirectBase = `${u.protocol}//${u.host}`;
    } catch (e) {
      this.logger.warn(`Derived frontend URL is not an absolute URL: ${normalizedUrl}. Falling back to '/'`);
      return res.redirect('/');
    }

    const safeToken = encodeURIComponent(token);
    const redirectTo = `${redirectBase}/auth/success?token=${safeToken}`;
    this.logger.log(`Redirecting user to frontend after OAuth: ${redirectTo}`);
    return res.redirect(redirectTo);
  }
}
