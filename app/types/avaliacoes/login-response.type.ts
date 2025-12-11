// export type LoginResponse = {
//     username: string;
//     password: string;
//     access: string;
//     refresh: string;
// }
export interface LoginResponse {
    refresh: string;
    access: string;
    primeiro_acesso: boolean;
  }