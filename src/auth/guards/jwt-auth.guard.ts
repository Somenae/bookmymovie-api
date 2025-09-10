import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly secret = process.env.JWT_SECRET || 'your-secret-key';
  
  // Routes publiques qui ne nécessitent pas d'authentification
  private readonly publicRoutes = [
    '/auth/register',
    '/auth/login',
  ];

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const url = request.url;
    
    // Vérifier si c'est une route publique
    if (this.isPublicRoute(url)) {
      return true; // ✅ Route publique, pas besoin de token
    }
    
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('Missing token');
    }
    
    try {
      const payload = jwt.verify(token, this.secret);
      request['user'] = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private isPublicRoute(url: string): boolean {
    return this.publicRoutes.some(route => url.startsWith(route));
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
