import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

export interface TokenPayload {
  sub: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  protected readonly logger = new Logger(JwtStrategy.name);
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          const authHeader = req.headers['authorization'];
          if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.slice(7);
          }
          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate({ sub }: TokenPayload) {
    try {
      return await this.authService.getUserByUserId(sub);
    } catch (err) {
      this.logger.error(err);
      throw new UnauthorizedException();
    }
  }
}
