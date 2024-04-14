/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-var-requires */
const jwt = require("jsonwebtoken");
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AdminRole } from "./adminRole/enums/admin.roles";
import { ROLES_KEY } from "./adminRole/admin.roles.decortator";
import appConfig from "./app.config";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<AdminRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredRoles) {
      return true;
    }
    const data = context.switchToHttp().getRequest();

    let token = "";

    data.rawHeaders.forEach((element) => {
      if (element.includes("Bearer")) {
        token = element.split(" ")[1];
      }
    });

    if (!token.length || !token) {
      throw new UnauthorizedException();
    }

    try {
      const decoded = jwt.verify(token, appConfig().security.jwtConstant);

      return requiredRoles.some((role) => decoded.accessLevel?.includes(role));
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
