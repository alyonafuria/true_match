import type { IIUser } from '@/types/auth';

export declare function loginWithII(
  onPrincipal: (principal: string) => void,
  user: IIUser
): Promise<void>;
