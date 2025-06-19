interface IIUser {
  id: string;
  email: string;
}

export declare function loginWithII(
  onPrincipal: (principal: string) => void,
  user: IIUser
): Promise<void>;