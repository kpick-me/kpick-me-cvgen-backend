import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async findOrCreateUser(oauthUser: any) {
  const email = oauthUser?.email || oauthUser?.emails?.[0]?.value;
  const name = oauthUser?.displayName || oauthUser?.profile?.displayName;
  const googleId = oauthUser?.profile?.id || oauthUser?.id;

  if (!email) {
    throw new Error('Email not provided by OAuth provider');
  }

  let user;

  if (googleId) {
    user = await this.prisma.user.findUnique({
      where: { googleId },
    });
  }

  if (!user) {
    user = await this.prisma.user.findUnique({
      where: { email },
    });
  }

  if (!user) {
    user = await this.prisma.user.create({
      data: {
        email,
        name,
        googleId,
      },
    });
  } else if (googleId && !user.googleId) {
    user = await this.prisma.user.update({
      where: { id: user.id },
      data: { googleId },
    });
  }

  return user;
}

async validateGoogleUser(profile: any) {
    const { id: googleId, emails, displayName } = profile;

    const email = emails?.[0]?.value;
    if (!email) {
      throw new Error('Google profile missing email');
    }

    let user = await this.prisma.user.findUnique({
      where: { googleId },
    });

    if (user) {
      return user;
    }

    user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      const updatedUser = await this.prisma.user.update({
        where: { id: user.id },
        data: { googleId },
      });
      return updatedUser;
    }

    const newUser = await this.prisma.user.create({
      data: {
        email,
        googleId,
        name: displayName,
      },
    });

    return newUser;
  }
  
  async getJwtToken(user: any) {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }
}