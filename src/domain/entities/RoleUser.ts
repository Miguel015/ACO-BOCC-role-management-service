export type RoleStatus = 'Activo' | 'Inactivo' | 'Eliminado';

export interface RoleUser {
  documentType: string;
  document: string;
  email: string;
  status: RoleStatus;
  observation?: string | null;
  deletedAt?: Date | null;
  userUpdated: string;
  updatedAt: Date;
}
