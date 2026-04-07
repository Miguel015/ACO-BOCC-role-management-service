import { RoleUserRepository } from '../../domain/repositories/RoleUserRepository';
import { RoleUser } from '../../domain/entities/RoleUser';
import { PaginatedResult } from '../../shared/types/Pagination';
import { ValidationError } from '../../shared/errors/ValidationError';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export interface ListRoleUsersRequest {
  page?: number | string;
  limit?: number | string;
}

export class ListRoleUsersUseCase {
  private repo: RoleUserRepository;

  constructor(repo: RoleUserRepository) {
    this.repo = repo;
  }

  async execute(request: ListRoleUsersRequest): Promise<PaginatedResult<RoleUser>> {
    const page = this.parsePositiveInt(request.page, DEFAULT_PAGE);
    const limit = this.parsePositiveInt(request.limit, DEFAULT_LIMIT);

    if (page < 1) {
      throw new ValidationError('page debe ser mayor o igual a 1');
    }
    if (limit < 1 || limit > MAX_LIMIT) {
      throw new ValidationError(`limit debe estar entre 1 y ${MAX_LIMIT}`);
    }

    return this.repo.findAll({ page, limit });
  }

  private parsePositiveInt(value: number | string | undefined, fallback: number): number {
    if (value === undefined || value === null || value === '') return fallback;
    const parsed = Number(value);
    if (isNaN(parsed) || !Number.isInteger(parsed)) return fallback;
    return parsed;
  }
}
