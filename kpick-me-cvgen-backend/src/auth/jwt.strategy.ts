import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_SECRET') || 'changeme',
    });
  }

  async validate(payload: any) {
    // payload contains the data we signed: { sub: user.id, email }
    // Return an object that matches controllers' expectations (req.user.id)
    return { id: payload.sub, email: payload.email };
  }
}
