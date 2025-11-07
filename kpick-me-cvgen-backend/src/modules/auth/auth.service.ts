import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateGoogleUser(profile: any) {
    const { id, emails, displayName, photos } = profile;
    
    let user = await this.userService.findByGoogleId(id);
    
    if (!user) {
      user = await this.userService.create({
        googleId: id,
        email: emails[0].value,
        name: displayName,
      });
    }
    
    return user;
  }

  login(user: any) {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }
}