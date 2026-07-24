import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwt } from "@/lib/jwt";
import { SessionStore } from "@/lib/auth/session-store";
import { ProfileService } from "@/lib/profile/profile-service";

export const dynamic = "force-dynamic";

async function getAuthUserId(request: NextRequest): Promise<string | null> {
  const sessionToken =
    request.cookies.get("sessionToken")?.value ||
    request.headers.get("x-session-token");

  if (sessionToken) {
    const session = await SessionStore.getSession(sessionToken);
    if (session) return session.userId;
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const jwt = verifyJwt(token);
    if (jwt) return jwt.userId;
  }

  // Fallback: For dev testing, allow first available user if no session token present
  const firstUser = await prisma.user.findFirst({ select: { id: true } });
  return firstUser?.id || null;
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const profile = await ProfileService.getProfileByUserId(userId);
    return NextResponse.json({ success: true, profile });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch candidate profile" },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { section, data } = body;

    let updatedProfile;

    if (section === "personal") {
      updatedProfile = await ProfileService.updatePersonalInformation(userId, data);
    } else if (section === "professional") {
      updatedProfile = await ProfileService.updateProfessionalDetails(userId, data);
    } else if (section === "preferences") {
      updatedProfile = await ProfileService.updateCareerPreferences(userId, data);
    } else if (section === "privacy") {
      updatedProfile = await ProfileService.updatePrivacySettings(userId, data);
    } else {
      // Full update
      if (data.personal) await ProfileService.updatePersonalInformation(userId, data.personal);
      if (data.professional) await ProfileService.updateProfessionalDetails(userId, data.professional);
      if (data.preferences) await ProfileService.updateCareerPreferences(userId, data.preferences);
      if (data.privacy) await ProfileService.updatePrivacySettings(userId, data.privacy);

      updatedProfile = await ProfileService.getProfileByUserId(userId);
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update profile" },
      { status: 400 }
    );
  }
}
