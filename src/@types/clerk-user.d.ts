export type Role = 'ADMIN' | 'MEMBER' | 'VISITOR';

declare global {
  interface UserPublicMetadata {
    role?: Role | null;
    orgId?: strin | null;
    teamId?: string | null;
  }
}
