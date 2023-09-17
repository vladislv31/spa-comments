import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secretKey', // TODO: dotenv
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.getByUsername(payload.username);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return { username: payload.username, id: payload.id };
  }
}
