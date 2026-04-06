export type RoleStatus = 'Activo' | 'Inactivo' | 'Eliminado';

export interface RoleUser {
    uuid: string;
    documentType: string;
    document: string;
    userName: string;
    email: string;
    status: RoleStatus;
    role: bigint;
    zone: String;
    observation?: string | null;
    deletedAt?: Date | null;
    userUpdated: string;
    updatedAt: Date;
}