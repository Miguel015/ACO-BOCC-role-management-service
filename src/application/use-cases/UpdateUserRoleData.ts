import {RoleUserRepository} from "../../domain/repositories/RoleUserRepository";
import {RoleUser} from "../../domain/entities/RoleUser";

export class UpdateUserRoleData{
   constructor(private repo: RoleUserRepository) {  }

    async execute(data: RoleUser){
       const roleUser = {
           nameUser: data.userName,
           role: data.role,
           zone: data.zone,
           userUpdated: data.userUpdated,
           updatedAt: data.updatedAt
       }
       await this.repo.updateRoleUserData(roleUser);
    }
}