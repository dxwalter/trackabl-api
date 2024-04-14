import { SetMetadata } from "@nestjs/common";
import { AdminRole } from "./enums/admin.roles";

export const ROLES_KEY = "roles";
export const AdminRoles = (...roles: AdminRole[]) =>
  SetMetadata(ROLES_KEY, roles);
