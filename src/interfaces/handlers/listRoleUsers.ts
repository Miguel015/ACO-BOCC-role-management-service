import { PostgresClient } from '../../infrastructure/persistence/db/PostgresClient';
import { PostgresRoleUserRepository } from '../../infrastructure/persistence/repositories/PostgresRoleUserRepository';
import { ListRoleUsersUseCase } from '../../application/use-cases/ListRoleUsersUseCase';
import { ApiResponse } from '../../shared/http/ApiResponse';
import { ValidationError } from '../../shared/errors/ValidationError';

const REQUIRED_HEADERS = ['X-RqUID', 'X-Channel', 'X-CompanyId', 'X-ClientDt'];

export const handler = async (event: any) => {
  const headers = event.headers || {};
  const getHeader = (name: string) => headers[name] || headers[name.toLowerCase()];
  const rqUID = getHeader('X-RqUID');

  for (const h of REQUIRED_HEADERS) {
    if (!getHeader(h)) {
      return ApiResponse.badRequest(rqUID || 'no-rquid', `Missing required header ${h}`);
    }
  }

  if (!rqUID) {
    return ApiResponse.badRequest('no-rquid', 'Missing X-RqUID header');
  }

  const queryParams = event.queryStringParameters || {};

  const repoClient = await PostgresClient.create();
  const repo = new PostgresRoleUserRepository(repoClient);
  const useCase = new ListRoleUsersUseCase(repo);

  try {
    const result = await useCase.execute({
      page: queryParams.page,
      limit: queryParams.limit,
    });

    return ApiResponse.ok(rqUID, result);
  } catch (err: any) {
    if (err instanceof ValidationError) {
      return ApiResponse.badRequest(rqUID, err.message);
    }
    console.error('Unhandled error', err);
    return ApiResponse.serverError(rqUID, 'Internal server error');
  }
};
