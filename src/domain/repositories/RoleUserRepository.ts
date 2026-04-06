import { RoleUser } from '../entities/RoleUser';

export interface RoleUserRepository {
  findByBusinessKey(documentType: string, document: string, email: string): Promise<RoleUser | null>;
  updateStatusToDeleted(input: {
    documentType: string;
    document: string;
    email: string;
    observation: string;
    userUpdated: string;
    deletedAt: Date;
    updatedAt: Date;
  }): Promise<boolean>;
}
