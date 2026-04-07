import { RoleUserRepository } from '../../../domain/repositories/RoleUserRepository';
import { PostgresClient } from '../db/PostgresClient';
import { RoleUser } from '../../../domain/entities/RoleUser';
import { PaginationParams, PaginatedResult } from '../../../shared/types/Pagination';

export class PostgresRoleUserRepository implements RoleUserRepository {
  private client: PostgresClient;

  constructor(client: PostgresClient) {
    this.client = client;
  }

  async findAll(params: PaginationParams): Promise<PaginatedResult<RoleUser>> {
    const offset = (params.page - 1) * params.limit;

    const countSql = `SELECT COUNT(*) AS total FROM role_user WHERE deleted_at IS NULL`;
    const countRes = await this.client.query<{ total: string }>(countSql);
    const totalItems = parseInt(countRes.rows[0].total, 10);

    const dataSql = `SELECT uuid, document_type, document, user_name, email, role_id,
                            status, zone, user_created, created_at, user_updated, updated_at,
                            observation, deleted_at
                     FROM role_user
                     WHERE deleted_at IS NULL
                     ORDER BY created_at DESC
                     LIMIT $1 OFFSET $2`;
    const dataRes = await this.client.query(dataSql, [params.limit, offset]);

    const data: RoleUser[] = dataRes.rows.map((r: any) => this.mapRowToEntity(r));

    return {
      data,
      pagination: {
        page: params.page,
        limit: params.limit,
        totalItems,
        totalPages: Math.ceil(totalItems / params.limit),
      },
    };
  }

  async findByBusinessKey(documentType: string, document: string, email: string): Promise<RoleUser | null> {
    const sql = `SELECT uuid, document_type, document, user_name, email, role_id,
                        status, zone, user_created, created_at, user_updated, updated_at,
                        observation, deleted_at
                 FROM role_user
                 WHERE document_type = $1 AND document = $2 AND email = $3
                 LIMIT 1`;
    const res = await this.client.query(sql, [documentType, document, email]);
    if (!res || !res.rows || res.rowCount === 0) return null;
    return this.mapRowToEntity(res.rows[0]);
  }

  private mapRowToEntity(r: any): RoleUser {
    return {
      uuid: r.uuid,
      documentType: r.document_type,
      document: r.document,
      userName: r.user_name,
      email: r.email,
      roleId: r.role_id,
      status: r.status,
      role: r.role,
      zone: r.zone,
      userCreated: r.user_created,
      createdAt: new Date(r.created_at),
      userUpdated: r.user_updated,
      updatedAt: new Date(r.updated_at),
      observation: r.observation ?? null,
      deletedAt: r.deleted_at ? new Date(r.deleted_at) : null,
    };
  }

  async updateStatusToDeleted(input: {
    documentType: string;
    document: string;
    email: string;
    observation: string;
    userUpdated: string;
    deletedAt: Date;
    updatedAt: Date;
  }): Promise<boolean> {
    const sql = `UPDATE role_user
                 SET status = 'Eliminado',
                     observation = $1,
                     deleted_at = $2,
                     user_updated = $3,
                     updated_at = $4
                 WHERE document_type = $5 AND document = $6 AND email = $7`;

    const params = [
      input.observation,
      input.deletedAt.toISOString(),
      input.userUpdated,
      input.updatedAt.toISOString(),
      input.documentType,
      input.document,
      input.email,
    ];

    const res = await this.client.query(sql, params);
    return res.rowCount > 0;
  }

  async updateRoleUserData(roleUser: RoleUser) {
    try {
      const result = await this.client.query("UPDATE ROLE_USER SET " +
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

  async create(roleUser: Partial<RoleUser>): Promise<RoleUser> {
    const sql = `
      INSERT INTO role_user (
        document_type, document, user_name, email, role_id, role,
        status, zone, user_created, user_updated, observation
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      ) RETURNING *;
    `;
    const params = [
      roleUser.documentType,
      roleUser.document,
      roleUser.userName,
      roleUser.email,
      roleUser.roleId,
      roleUser.role,
      roleUser.status || 'Activo',
      roleUser.zone,
      roleUser.userCreated,
      roleUser.userUpdated || roleUser.userCreated,
      roleUser.observation || null
    ];

    const res = await this.client.query(sql, params);
    return this.mapRowToEntity(res.rows[0]);
  }
}
