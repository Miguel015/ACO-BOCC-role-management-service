export type RoleStatus = 'Activo' | 'Inactivo' | 'Eliminado';

export interface RoleUser {
  uuid: string;
  documentType: string;
  document: string;
  userName: string;
  email: string;
  roleId: number;
  status: RoleStatus;
  zone: string;
  userCreated: string;
  createdAt: Date;
  userUpdated: string;
  updatedAt: Date;
  observation?: string | null;
  deletedAt?: Date | null;
}
