import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { Request } from "express";

import { CSRF_PROTECTED_KEY } from "../decorators/csrf-protected.decorator";
import { CsrfService } from "../services/csrf.service";

@Injectable()
export class CsrfGuard implements CanActivate {
  constructor(
    private readonly config: ConfigService,
    private readonly csrf: CsrfService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const required = this.reflector.getAllAndOverride<boolean>(
      CSRF_PROTECTED_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required || !this.config.getOrThrow<boolean>("security.csrfEnabled")) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = request.header("x-csrf-token");
    if (!token || !(await this.csrf.verifyToken(token))) {
      throw new ForbiddenException("Invalid CSRF token.");
    }

    return true;
  }
}
