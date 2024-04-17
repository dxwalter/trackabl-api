import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { AdminService } from "./admin.service";
import { UserService } from "../user/user.service";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { LoginAdminDTO } from "./dto/login-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import { Utils } from "../utils";
import { GlobalErrorService } from "../globals/global.error.service";
import { CreatAdminAccountResponse } from "./types/admin.types";
import { AuthGuard } from "../user/guard/auth.guard";
import { CreateAdminAccount } from "./classes/Auth/AdminCreateAccount";
import { AdminLogin } from "./classes/Auth/AdminLogin";
import { AdminRoles } from "../../Config/adminRole/admin.roles.decortator";
import { AdminRole } from "../../Config/adminRole/enums/admin.roles";
import { RolesGuard } from "../../Config/roles.guard";

@Controller("admin")
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
    private utils: Utils,
    private readonly globalError: GlobalErrorService
  ) {}

  @AdminRoles(AdminRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Post("/create")
  async create(
    @Body() createAdminDto: CreateAdminDto
  ): Promise<CreatAdminAccountResponse> {
    return await new CreateAdminAccount(
      this.adminService,
      this.userService,
      this.utils,
      this.globalError
    ).createAdmin(createAdminDto);
  }

  @Post("/login")
  async login(
    @Body() loginAdmin: LoginAdminDTO
  ): Promise<CreatAdminAccountResponse> {
    return await new AdminLogin(
      this.adminService,
      this.userService,
      this.utils,
      this.globalError
    ).logAdminIn(loginAdmin);
  }

  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.adminService.remove(+id);
  }
}
