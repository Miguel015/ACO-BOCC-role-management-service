import { PostgresClient } from '../../infrastructure/persistence/db/PostgresClient';
import { PostgresRoleUserRepository } from '../../infrastructure/persistence/repositories/PostgresRoleUserRepository';
import { UpdateUserRoleStatusUseCase } from '../../application/use-cases/UpdateUserRoleStatusUseCase';
import { ApiResponse } from '../../shared/http/ApiResponse';
import { ValidationError } from '../../shared/errors/ValidationError';
import { NotFoundError } from '../../shared/errors/NotFoundError';
import { ConflictError } from '../../shared/errors/ConflictError';

const REQUIRED_HEADERS = ['X-RqUID', 'X-Channel', 'X-CompanyId', 'X-ClientDt'];

export const handler = async (event: any) => {
  const headers = event.headers || {};
  const getHeader = (name: string) => headers[name] || headers[name.toLowerCase()];
  const rqUID = getHeader('X-RqUID');

  // validate headers
  for (const h of REQUIRED_HEADERS) {
    if (!getHeader(h)) {
      return ApiResponse.badRequest(rqUID || 'no-rquid', `Missing required header ${h}`);
    }
  }

  if (!rqUID) {
    return ApiResponse.badRequest('no-rquid', 'Missing X-RqUID header');
  }

  let body: any;
  try {
    if (!event.body) throw new Error('Missing body');
    body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
  } catch (err: any) {
    return ApiResponse.badRequest(rqUID, 'Invalid JSON body');
  }

  const repoClient = await PostgresClient.create();
  const repo = new PostgresRoleUserRepository(repoClient);
  const useCase = new UpdateUserRoleStatusUseCase(repo);

  try {
    const result = await useCase.execute(body);
    return ApiResponse.json(rqUID, 200, 'Estado actualizado', result);
  } catch (err: any) {
    if (err instanceof ValidationError) {
      return ApiResponse.badRequest(rqUID, err.message);
    }
    if (err instanceof NotFoundError) {
      return ApiResponse.notFound(rqUID, err.message);
    }
    if (err instanceof ConflictError) {
      return ApiResponse.conflict(rqUID, err.message);
    }
    console.error('Unhandled error', err);
    return ApiResponse.serverError(rqUID, 'Internal server error');
  }
};
