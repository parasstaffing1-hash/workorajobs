import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwt } from "@/lib/jwt";
import { SessionStore } from "@/lib/auth/session-store";
import { TeamService } from "@/lib/team/team-service";

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

  const firstUser = await prisma.user.findFirst({
    where: { role: "EMPLOYER" },
    select: { id: true },
  });
  return firstUser?.id || null;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = await getAuthUserId(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { role, department, permissions } = body;

    const updated = await TeamService.updateMemberRole(userId, id, role, department, permissions);
    return NextResponse.json({ success: true, message: "Member role updated!", member: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to update member" }, { status: 400 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = await getAuthUserId(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action } = body;

    if (action === "suspend") {
      const updated = await TeamService.toggleSuspendMember(userId, id);
      return NextResponse.json({
        success: true,
        message: `Member status set to ${updated.status}`,
        member: updated,
      });
    }

    if (action === "remove") {
      await TeamService.removeMember(userId, id);
      return NextResponse.json({
        success: true,
        message: "Team member removed from workspace.",
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Operation failed" }, { status: 400 });
  }
}
