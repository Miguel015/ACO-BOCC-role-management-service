import { RoleUserRepository } from '../../domain/repositories/RoleUserRepository';
import { RoleUser } from '../../domain/entities/RoleUser';
import { ValidationError } from '../../shared/errors/ValidationError';

export class CreateRoleUserUseCase {
  constructor(private readonly roleUserRepository: RoleUserRepository) {}

  async execute(input: Partial<RoleUser>): Promise<RoleUser> {
    if (!input.documentType || !input.document || !input.email || !input.roleId) {
      throw new ValidationError('Missing required fields for RoleUser creation.');
    }

    // Check if the user already exists
    const existing = await this.roleUserRepository.findByBusinessKey(
      input.documentType,
      input.document,
      input.email
    );

    if (existing) {
      throw new ValidationError('RoleUser combination already exists.');
    }

    // Create the new user and return it
    const newRoleUser = await this.roleUserRepository.create(input);
    return newRoleUser;
  }
}
