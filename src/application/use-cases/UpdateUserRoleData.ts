import {RoleUserRepository} from "../../domain/repositories/RoleUserRepository";
import {RoleUser} from "../../domain/entities/RoleUser";

export class UpdateUserRoleData{
   constructor(private repo: RoleUserRepository) {  }

    async execute(data: RoleUser){
       // repository expects a full RoleUser entity; caller provides it
       await this.repo.updateRoleUserData(data);
    }
}