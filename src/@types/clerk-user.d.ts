export type Role = 'ADMIN' | 'MEMBER' | 'VISITOR';

declare global {
  interface UserPublicMetadata {
    role: Role;
    orgId: string;
  }
}
