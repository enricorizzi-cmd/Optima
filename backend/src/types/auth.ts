export type OrgRole = 'owner' | 'admin' | 'editor' | 'viewer';

export interface AuthUser {
  id: string;
  email: string;
  role: OrgRole;
  orgId: string;
}
