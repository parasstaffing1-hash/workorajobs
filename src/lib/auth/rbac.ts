export type UserRole = "JOB_SEEKER" | "EMPLOYER" | "RECRUITER" | "ADMIN" | "USER" | "EDITOR" | "SEO_MANAGER";

export class RbacGuard {
  static isAdmin(role?: string): boolean {
    return role === "ADMIN";
  }

  static isEmployerOrAdmin(role?: string): boolean {
    return role === "EMPLOYER" || role === "ADMIN" || role === "RECRUITER";
  }

  static isJobSeeker(role?: string): boolean {
    return role === "JOB_SEEKER" || role === "USER" || role === "ADMIN";
  }

  static canAccessResource(currentUserId: string, currentUserRole: string, resourceOwnerId: string): boolean {
    if (this.isAdmin(currentUserRole)) return true;
    return currentUserId === resourceOwnerId;
  }
}
