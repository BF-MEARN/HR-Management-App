export interface InviteRequest {
  name: string;
  email: string;
}

export interface RegistrationToken {
  name: string;
  email: string;
  token: string;
  used: boolean;
  createdAt: string;
}
