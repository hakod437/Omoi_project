import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedUser, JwtPayload } from '../types/authenticated-user.type';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | undefined>;
      user?: AuthenticatedUser;
    }>();
    const token = this.extractTokenFromHeader(request.headers.authorization);

    if (!token) {
      throw new UnauthorizedException({
        code: 'AUTH_MISSING_TOKEN',
        message: 'Missing bearer token',
        details: null,
      });
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      });

      request.user = {
        userId: payload.sub,
        email: payload.email,
      };

      return true;
    } catch {
      throw new UnauthorizedException({
        code: 'AUTH_INVALID_TOKEN',
        message: 'Invalid or expired access token',
        details: null,
      });
    }
  }

  private extractTokenFromHeader(authHeader?: string): string | null {
    if (!authHeader) {
      return null;
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      return null;
    }

    return token;
  }
}