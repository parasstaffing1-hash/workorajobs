import { prisma } from "@/lib/prisma";
import { CompanyService } from "@/lib/company/company-service";
import { EmployerRole, ROLE_CONFIGS } from "@/lib/team/team-rbac-config";

export class TeamService {
  /**
   * Get Team Members for Employer Company
   */
  static async getTeamMembers(employerUserId: string) {
    const { company } = await CompanyService.getEmployerCompany(employerUserId);

    const members = await prisma.companyUser.findMany({
      where: { companyId: company.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            loginHistory: { orderBy: { createdAt: "desc" }, take: 1 },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return {
      companyName: company.name,
      members: members.map((m) => ({
        id: m.id,
        userId: m.userId,
        name: m.user.name || m.invitedEmail || "Team Member",
        email: m.user.email || m.invitedEmail,
        role: m.role as EmployerRole,
        department: m.department || "Engineering",
        status: m.status || "ACTIVE",
        permissions: m.permissions.length > 0 ? m.permissions : ROLE_CONFIGS[m.role as EmployerRole]?.defaultPermissions || [],
        lastLogin: m.user.loginHistory[0]?.createdAt || m.createdAt,
        joinedAt: m.createdAt,
      })),
    };
  }

  /**
   * Invite New Team Member
   */
  static async inviteMember(
    employerUserId: string,
    email: string,
    role: EmployerRole,
    department = "Engineering",
    permissions?: string[]
  ) {
    const { company } = await CompanyService.getEmployerCompany(employerUserId);

    // Check if user exists by email or create placeholder
    let targetUser = await prisma.user.findUnique({ where: { email } });

    if (!targetUser) {
      targetUser = await prisma.user.create({
        data: {
          email,
          name: email.split("@")[0],
          role: "EMPLOYER",
        },
      });
    }

    const defaultPerms = permissions || ROLE_CONFIGS[role]?.defaultPermissions || [];

    const member = await prisma.companyUser.upsert({
      where: {
        companyId_userId: {
          companyId: company.id,
          userId: targetUser.id,
        },
      },
      update: {
        role: role as any,
        department,
        status: "ACTIVE",
        permissions: defaultPerms,
      },
      create: {
        companyId: company.id,
        userId: targetUser.id,
        role: role as any,
        department,
        status: "ACTIVE",
        permissions: defaultPerms,
        invitedEmail: email,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: employerUserId,
        action: `TEAM_MEMBER_INVITED:${email}:${role}`,
      },
    });

    return member;
  }

  /**
   * Update Member Role & Department
   */
  static async updateMemberRole(
    employerUserId: string,
    memberId: string,
    role: EmployerRole,
    department?: string,
    permissions?: string[]
  ) {
    const defaultPerms = permissions || ROLE_CONFIGS[role]?.defaultPermissions || [];

    const updated = await prisma.companyUser.update({
      where: { id: memberId },
      data: {
        role: role as any,
        department: department || undefined,
        permissions: defaultPerms,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: employerUserId,
        action: `TEAM_MEMBER_ROLE_UPDATED:${memberId}:${role}`,
      },
    });

    return updated;
  }

  /**
   * Toggle Suspend Member Status
   */
  static async toggleSuspendMember(employerUserId: string, memberId: string) {
    const existing = await prisma.companyUser.findUnique({ where: { id: memberId } });
    if (!existing) throw new Error("Member record not found.");

    const newStatus = existing.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";

    const updated = await prisma.companyUser.update({
      where: { id: memberId },
      data: { status: newStatus },
    });

    await prisma.auditLog.create({
      data: {
        userId: employerUserId,
        action: `TEAM_MEMBER_STATUS_CHANGED:${memberId}:${newStatus}`,
      },
    });

    return updated;
  }

  /**
   * Remove Member from Company Workspace
   */
  static async removeMember(employerUserId: string, memberId: string) {
    await prisma.companyUser.delete({ where: { id: memberId } });

    await prisma.auditLog.create({
      data: {
        userId: employerUserId,
        action: `TEAM_MEMBER_REMOVED:${memberId}`,
      },
    });

    return true;
  }
}
