import { RoleUser } from '../entities/RoleUser';
import { PaginationParams, PaginatedResult } from '../../shared/types/Pagination';

export interface RoleUserRepository {
   updateRoleUserData(roleUser: RoleUser): Promise<boolean>;
  findAll(params: PaginationParams): Promise<PaginatedResult<RoleUser>>;
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