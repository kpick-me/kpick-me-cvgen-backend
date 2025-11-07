import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  // Finds existing user by email or creates a new one
  async findOrCreateUser(oauthUser: any) {
    const email = oauthUser?.email || oauthUser?.emails?.[0]?.value;
    const name = oauthUser?.displayName || oauthUser?.profile?.displayName;
    const googleId = oauthUser?.profile?.id || oauthUser?.id;

    if (!email) {
      throw new Error('Email not provided by OAuth provider');
    }

  let user: any = null;

    // Prefer lookup by googleId when available. Guard against missing DB column (P2022).
    if (googleId) {
      try {
        user = await this.prisma.user.findUnique({ where: { googleId } as any });
      } catch (err: any) {
        // If DB doesn't have googleId column yet (migration not applied), ignore and fallback to email lookup
        if (err?.code !== 'P2022') throw err;
      }
    }

    if (!user) {
      user = await this.prisma.user.findUnique({ where: { email } });
    }

    if (!user) {
      user = await this.prisma.user.create({ data: { email, name, googleId } });
    } else if (googleId && !user.googleId) {
      // Attach googleId to existing user if possible
      try {
        await this.prisma.user.update({ where: { id: user.id }, data: { googleId } as any });
        user = { ...user, googleId } as any;
      } catch (err: any) {
        if (err?.code !== 'P2022') throw err;
        // ignore if column missing
      }
    }

    return user;
  }

  // Generates JWT signed with JWT_SECRET
  async getJwtToken(user: any) {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }
}
