import { RoleUserRepository } from '../../../domain/repositories/RoleUserRepository';
import { PostgresClient } from '../db/PostgresClient';
import { RoleUser } from '../../../domain/entities/RoleUser';

export class PostgresRoleUserRepository implements RoleUserRepository {
  private client: PostgresClient;

  constructor(client: PostgresClient) {
    this.client = client;
  }

  async findByBusinessKey(documentType: string, document: string, email: string): Promise<RoleUser | null> {
    const sql = `SELECT document_type, document, email, status, observation, deleted_at, user_updated, updated_at
                 FROM role_user
                 WHERE document_type = $1 AND document = $2 AND email = $3
                 LIMIT 1`;
    const res = await this.client.query(sql, [documentType, document, email]);
    if (!res || !res.rows || res.rowCount === 0) return null;
    const r: any = res.rows[0];
    return {
      documentType: r.document_type,
      document: r.document,
      email: r.email,
      status: r.status,
      observation: r.observation ?? null,
      deletedAt: r.deleted_at ? new Date(r.deleted_at) : null,
      userUpdated: r.user_updated,
      updatedAt: r.updated_at ? new Date(r.updated_at) : new Date(),
    } as RoleUser;
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
}
