export type Role = "ADMIN" | "EDITOR" | "AUTHOR" | "WRITER";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export type Action =
  | "article:create"
  | "article:edit"
  | "article:edit_others"
  | "article:publish"
  | "article:schedule"
  | "article:feature"
  | "article:breaking"
  | "article:delete"
  | "category:manage"
  | "tag:manage"
  | "media:view"
  | "media:upload"
  | "media:delete"
  | "users:manage"
  | "settings:manage"
  | "audit:view";

export function can(
  user: { role: Role; id?: string },
  action: Action,
  resource?: { authorId?: string; status?: string }
): boolean {
  // Admin can do everything
  if (user.role === "ADMIN") return true;

  if (user.role === "EDITOR") {
    switch (action) {
      case "article:create":
      case "article:edit":
      case "article:edit_others":
      case "article:publish":
      case "article:schedule":
      case "article:feature":
      case "article:breaking":
      case "article:delete":
      case "category:manage":
      case "tag:manage":
      case "media:view":
      case "media:upload":
      case "media:delete":
        return true;
      case "users:manage":
      case "settings:manage":
      case "audit:view":
        return false;
      default:
        return false;
    }
  }

  if (user.role === "AUTHOR" || user.role === "WRITER") {
    switch (action) {
      case "article:create":
        return true;
      case "article:edit":
        // Writer can only edit their own articles
        return !resource?.authorId || resource.authorId === user.id;
      case "article:delete":
        // Writer can only delete their own drafts
        return (
          (!resource?.authorId || resource.authorId === user.id) &&
          resource?.status === "DRAFT"
        );
      case "media:upload":
        return true;
      case "media:view":
        return true;
      case "article:edit_others":
      case "article:publish":
      case "article:schedule":
      case "article:feature":
      case "article:breaking":
      case "category:manage":
      case "tag:manage":
      case "media:delete":
      case "users:manage":
      case "settings:manage":
      case "audit:view":
        return false;
      default:
        return false;
    }
  }

  return false;
}

export function requireRole(userRole: Role, allowedRoles: Role[]): boolean {
  return allowedRoles.includes(userRole);
}
