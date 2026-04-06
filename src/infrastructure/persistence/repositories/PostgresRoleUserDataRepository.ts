import {RoleUserRepository} from "../../../domain/repositories/RoleUserRepository";
import {RoleUser} from "../../../domain/entities/RoleUser";

export class PostgresRoleUserDataRepository implements RoleUserRepository{
    async updateRoleUserData(roleUser:RoleUser) {
        try {
            const db = await;

            const result = await db.query("UPDATE ROLE_USER SET " +
                "userName = ?, " +
                "role = ?, " +
                "zone = ?, " +
                "userUpdated = ?, " +
                "updatedAt = ? WHERE uuid = ?",
                [
                    roleUser.userName, roleUser.role, roleUser.zone, roleUser.userUpdated,
                    roleUser.updatedAt, roleUser.uuid
                ]);
            return result.rowCount > 0;
        } catch (err) {
            return false;
        }

    }

}