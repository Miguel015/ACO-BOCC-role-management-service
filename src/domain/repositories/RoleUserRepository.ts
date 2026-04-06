import {RoleUser} from "../entities/RoleUser";

export interface RoleUserRepository{
    updateRoleUserData(roleUser: RoleUser): Promise<boolean>;
}