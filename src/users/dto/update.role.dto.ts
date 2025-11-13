import { IsEnum, IsNotEmpty } from "class-validator";
import { Role } from "src/auth/enum/role.enum";

export class updateRoleDto{
    @IsNotEmpty()
    @IsEnum(Role)
    role: Role
}