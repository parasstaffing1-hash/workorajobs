import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import xss from "xss";

type Sanitizable =
  | string
  | number
  | boolean
  | null
  | Sanitizable[]
  | { [key: string]: Sanitizable };

@Injectable()
export class SanitizeMiddleware implements NestMiddleware {
  use(request: Request, _response: Response, next: NextFunction) {
    if (request.body) {
      request.body = this.sanitize(request.body) as Request["body"];
    }
    if (request.params) {
      request.params = this.sanitize(request.params) as Request["params"];
    }
    next();
  }

  private sanitize(value: unknown): Sanitizable | undefined {
    if (typeof value === "string") return xss(value.trim());
    if (
      typeof value === "number" ||
      typeof value === "boolean" ||
      value === null
    ) {
      return value;
    }
    if (Array.isArray(value)) {
      return value.map((item) => this.sanitize(item) ?? null);
    }
    if (typeof value === "object" && value !== null) {
      return Object.fromEntries(
        Object.entries(value).map(([key, item]) => [
          key,
          this.sanitize(item) ?? null,
        ]),
      );
    }
    return undefined;
  }
}
