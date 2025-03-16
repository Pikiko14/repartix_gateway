import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { envs } from 'src/configuration';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(context);
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Unauthorized access');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: envs.jwt_secret,
      });

      // Asignar usuario al request para su uso posterior
      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized access');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }

  private getRequest(context: ExecutionContext): Request {
    return context.switchToHttp().getRequest();
  }
}
