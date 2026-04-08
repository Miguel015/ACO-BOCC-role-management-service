import { UpdateUserRoleStatusUseCase } from '../src/application/use-cases/UpdateUserRoleStatusUseCase';
import { ValidationError } from '../src/shared/errors/ValidationError';
import { NotFoundError } from '../src/shared/errors/NotFoundError';
import { ConflictError } from '../src/shared/errors/ConflictError';
import { RoleUser } from '../src/domain/entities/RoleUser';

describe('OP3 UpdateUserRoleStatusUseCase (Eliminar)', () => {
  const makeRepo = (existing: RoleUser | null, updateResult = true) => ({
    findByBusinessKey: jest.fn().mockResolvedValue(existing),
    updateStatusToDeleted: jest.fn().mockResolvedValue(updateResult),
  });

  test('status != Eliminado -> ValidationError', async () => {
    const repo: any = makeRepo({} as RoleUser);
    const uc = new UpdateUserRoleStatusUseCase(repo);
    await expect(
      uc.execute({ document_type: 'CC', document: '1', email: 'a@a', status: 'Inactivo', observation: 'x', user_updated: 'u' })
    ).rejects.toThrow(ValidationError);
  });

  test('observation vacía -> ValidationError', async () => {
    const repo: any = makeRepo({ status: 'Activo' } as RoleUser);
    const uc = new UpdateUserRoleStatusUseCase(repo);
    await expect(
      uc.execute({ document_type: 'CC', document: '1', email: 'a@a', status: 'Eliminado', observation: '', user_updated: 'u' })
    ).rejects.toThrow(ValidationError);
  });

  test('usuario no existe -> NotFoundError', async () => {
    const repo: any = makeRepo(null);
    const uc = new UpdateUserRoleStatusUseCase(repo);
    await expect(
      uc.execute({ document_type: 'CC', document: '1', email: 'a@a', status: 'Eliminado', observation: 'motivo', user_updated: 'u' })
    ).rejects.toThrow(NotFoundError);
  });

  test('status actual != Activo -> ConflictError', async () => {
    const repo: any = makeRepo({ status: 'Eliminado' } as RoleUser);
    const uc = new UpdateUserRoleStatusUseCase(repo);
    await expect(
      uc.execute({ document_type: 'CC', document: '1', email: 'a@a', status: 'Eliminado', observation: 'motivo', user_updated: 'u' })
    ).rejects.toThrow(ConflictError);
  });

  test('ok -> returns Eliminado and deleted_at', async () => {
    const now = new Date();
    const existing: RoleUser = {
      uuid: 'uuid-1',
      documentType: 'CC',
      document: '1',
      userName: 'Test User',
      email: 'a@a',
      roleId: 1,
      role: 'ROLE',
      status: 'Activo',
      zone: 'NORTE',
      userCreated: 'admin',
      createdAt: now,
      observation: null,
      deletedAt: null,
      userUpdated: 'x',
      updatedAt: now,
    };
    const repo: any = makeRepo(existing, true);
    const uc = new UpdateUserRoleStatusUseCase(repo);
    const res = await uc.execute({ document_type: 'CC', document: '1', email: 'a@a', status: 'Eliminado', observation: 'motivo', user_updated: 'u' });
    expect(res).toHaveProperty('status', 'Eliminado');
    expect(res).toHaveProperty('deleted_at');
  });
});
