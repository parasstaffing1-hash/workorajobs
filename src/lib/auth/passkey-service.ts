import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { SessionStore } from "@/lib/auth/session-store";
import { signJwt } from "@/lib/jwt";

export interface PasskeyCredential {
  id: string;
  name: string;
  credentialId: string;
  publicKey: string;
  counter: number;
  deviceType: string;
  createdAt: string;
}

export class PasskeyService {
  /**
   * Generate WebAuthn Passkey Registration Options
   */
  static async generateRegistrationOptions(userId: string, email: string) {
    const challenge = crypto.randomBytes(32).toString("base64url");

    return {
      challenge,
      rp: {
        name: "WorkoraJobs Enterprise",
        id: typeof window !== "undefined" ? window.location.hostname : "localhost",
      },
      user: {
        id: Buffer.from(userId).toString("base64url"),
        name: email,
        displayName: email.split("@")[0],
      },
      pubKeyCredParams: [
        { alg: -7, type: "public-key" },  // ES256
        { alg: -257, type: "public-key" }, // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: "platform", // Touch ID, Face ID, Windows Hello
        userVerification: "preferred",
        residentKey: "preferred",
      },
      timeout: 60000,
    };
  }

  /**
   * Complete WebAuthn Passkey Registration
   */
  static async registerPasskey(userId: string, name: string, credentialId: string, publicKey: string) {
    if (!credentialId || !publicKey) {
      throw new Error("Passkey credentialId and publicKey are required.");
    }

    const passkey = await prisma.oAuthAccount.create({
      data: {
        userId,
        provider: "passkey",
        providerAccountId: credentialId,
        accessToken: publicKey,
        scope: name || "Windows Hello / Touch ID",
      },
    });

    return { success: true, passkeyId: passkey.id };
  }

  /**
   * Authenticate Passkey Login
   */
  static async verifyPasskeyLogin(credentialId: string) {
    if (!credentialId) {
      throw new Error("Passkey credentialId is required.");
    }

    const passkey = await prisma.oAuthAccount.findUnique({
      where: {
        provider_providerAccountId: {
          provider: "passkey",
          providerAccountId: credentialId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            deletedAt: true,
          },
        },
      },
    });

    if (!passkey || passkey.user.deletedAt) {
      throw new Error("Passkey credential was not found.");
    }

    const session = await SessionStore.createSession({
      userId: passkey.user.id,
      email: passkey.user.email,
      role: passkey.user.role,
    });

    const token = signJwt({
      userId: passkey.user.id,
      email: passkey.user.email,
      role: passkey.user.role,
    });

    return {
      success: true,
      token,
      sessionToken: session.sessionToken,
      user: {
        id: passkey.user.id,
        email: passkey.user.email,
        name: passkey.user.name,
        role: passkey.user.role,
      },
    };
  }
}
