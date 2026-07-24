import crypto from "crypto";
import { SecretsRotationService } from "@/lib/config/env-validator";

const SECRET = process.env.JWT_SECRET || "workora-super-secret-encryption-key-jwt-auth";

// Pre-compute the secret buffer once at module load (avoids repeated allocation)
const SECRET_BUFFER = Buffer.from(SECRET);

export interface JwtPayload {
  userId: string;
  role: string;
  email: string;
}

export function signJwt(payload: JwtPayload, expirySeconds = 86400): string {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64url");

  const payloadWithExp = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + expirySeconds,
    iat: Math.floor(Date.now() / 1000),
  };
  const encodedPayload = Buffer.from(JSON.stringify(payloadWithExp)).toString("base64url");

  const signature = crypto
    .createHmac("sha256", SECRET_BUFFER)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64url");

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [header, payload, signature] = parts;

    // Verify signature with dual-key rotation support and timing-safe comparison
    const isValidSignature = SecretsRotationService.verifyHmacSignature(
      `${header}.${payload}`,
      signature
    );

    if (!isValidSignature) {
      return null;
    }

    const decodedPayload = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    ) as JwtPayload & { exp?: number };

    if (decodedPayload.exp && decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Token has expired
    }

    return {
      userId: decodedPayload.userId,
      role: decodedPayload.role,
      email: decodedPayload.email,
    };
  } catch {
    return null;
  }
}

