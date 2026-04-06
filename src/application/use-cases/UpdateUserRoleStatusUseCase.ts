import { RoleUserRepository } from '../../domain/repositories/RoleUserRepository';
import { ValidationError } from '../../shared/errors/ValidationError';
import { NotFoundError } from '../../shared/errors/NotFoundError';
import { ConflictError } from '../../shared/errors/ConflictError';
import { RoleStatus } from '../../domain/entities/RoleUser';

export interface UpdateUserRoleStatusRequest {
  document_type: string;
  document: string;
  email: string;
  status: string;
  observation?: string | null;
  user_updated: string;
}

export class UpdateUserRoleStatusUseCase {
  private repo: RoleUserRepository;

  constructor(repo: RoleUserRepository) {
    this.repo = repo;
  }

  async execute(request: UpdateUserRoleStatusRequest): Promise<{ status: RoleStatus; deleted_at?: string }>
  {
    // required fields
    const { document_type, document, email, status, observation, user_updated } = request;

    if (!document_type || !document || !email || !status || !user_updated) {
      throw new ValidationError('Missing required fields');
    }

    // Exact rule: only status === 'Eliminado' is accepted for this operation
    if ((status as string) !== 'Eliminado') {
      throw new ValidationError('Solo se permite status=Eliminado en esta operación');
    }

    if (observation === undefined || observation === null || String(observation).trim() === '') {
      throw new ValidationError('observation is required when status is Eliminado');
    }

    const deletedAt = new Date();
    const updatedAt = new Date();

    const existing = await this.repo.findByBusinessKey(document_type, document, email);
    if (!existing) {
      throw new NotFoundError('Role user not found');
    }

    // Only allow transition from Activo -> Eliminado
    if (existing.status !== 'Activo') {
      throw new ConflictError('Solo se permite la transición Activo -> Eliminado');
    }

    const updated = await this.repo.updateStatusToDeleted({
      documentType: document_type,
      document,
      email,
      observation: String(observation),
      deletedAt,
      userUpdated: user_updated,
      updatedAt,
    });

    if (!updated) {
      throw new NotFoundError('Role user not found');
    }

    return { status: 'Eliminado', deleted_at: deletedAt.toISOString() };
  }
}
