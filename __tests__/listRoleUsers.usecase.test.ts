import { ListRoleUsersUseCase } from '../src/application/use-cases/ListRoleUsersUseCase';
import { ValidationError } from '../src/shared/errors/ValidationError';
import { RoleUser } from '../src/domain/entities/RoleUser';
import { PaginatedResult } from '../src/shared/types/Pagination';

const now = new Date();

const makeFakeUser = (i: number): RoleUser => ({
  uuid: `uuid-${i}`,
  documentType: 'CC',
  document: `109876543${i}`,
  userName: `User ${i}`,
  email: `user${i}@example.com`,
  roleId: 1,
  status: 'Activo',
  zone: 'NORTE',
  userCreated: 'admin',
  createdAt: now,
  userUpdated: 'admin',
  updatedAt: now,
  observation: null,
  deletedAt: null,
});

const makeRepo = (result: PaginatedResult<RoleUser>) => ({
  findAll: jest.fn().mockResolvedValue(result),
  findByBusinessKey: jest.fn(),
  updateStatusToDeleted: jest.fn(),
});

describe('ListRoleUsersUseCase', () => {
  test('retorna lista paginada con valores por defecto (page=1, limit=10)', async () => {
    const users = Array.from({ length: 10 }, (_, i) => makeFakeUser(i));
    const paginatedResult: PaginatedResult<RoleUser> = {
      data: users,
      pagination: { page: 1, limit: 10, totalItems: 25, totalPages: 3 },
    };
    const repo: any = makeRepo(paginatedResult);
    const uc = new ListRoleUsersUseCase(repo);

    const result = await uc.execute({});

    expect(repo.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
    expect(result.data).toHaveLength(10);
    expect(result.pagination.totalItems).toBe(25);
    expect(result.pagination.totalPages).toBe(3);
  });

  test('acepta page y limit como strings (query params)', async () => {
    const paginatedResult: PaginatedResult<RoleUser> = {
      data: [makeFakeUser(1)],
      pagination: { page: 2, limit: 5, totalItems: 6, totalPages: 2 },
    };
    const repo: any = makeRepo(paginatedResult);
    const uc = new ListRoleUsersUseCase(repo);

    await uc.execute({ page: '2', limit: '5' });

    expect(repo.findAll).toHaveBeenCalledWith({ page: 2, limit: 5 });
  });

  test('limit > 100 -> ValidationError', async () => {
    const repo: any = makeRepo({ data: [], pagination: { page: 1, limit: 101, totalItems: 0, totalPages: 0 } });
    const uc = new ListRoleUsersUseCase(repo);

    await expect(uc.execute({ limit: 101 })).rejects.toThrow(ValidationError);
  });

  test('page < 1 -> ValidationError', async () => {
    const repo: any = makeRepo({ data: [], pagination: { page: 0, limit: 10, totalItems: 0, totalPages: 0 } });
    const uc = new ListRoleUsersUseCase(repo);

    await expect(uc.execute({ page: 0 })).rejects.toThrow(ValidationError);
  });

  test('valores no numéricos usan defaults', async () => {
    const paginatedResult: PaginatedResult<RoleUser> = {
      data: [],
      pagination: { page: 1, limit: 10, totalItems: 0, totalPages: 0 },
    };
    const repo: any = makeRepo(paginatedResult);
    const uc = new ListRoleUsersUseCase(repo);

    await uc.execute({ page: 'abc', limit: 'xyz' });

    expect(repo.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
  });

  test('retorna lista vacía cuando no hay registros', async () => {
    const paginatedResult: PaginatedResult<RoleUser> = {
      data: [],
      pagination: { page: 1, limit: 10, totalItems: 0, totalPages: 0 },
    };
    const repo: any = makeRepo(paginatedResult);
    const uc = new ListRoleUsersUseCase(repo);

    const result = await uc.execute({});

    expect(result.data).toHaveLength(0);
    expect(result.pagination.totalItems).toBe(0);
    expect(result.pagination.totalPages).toBe(0);
  });
});
