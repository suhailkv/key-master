export type RootStackParamList = {
    ViewPasswords: { info?: string };
    AddPassword:  PasswordItem | undefined;
    Authentication:undefined
};
export interface PasswordEntry {
    website: string;
    username?: string;
    password: string;
}
export interface StoredPassword {
    id: string | undefined;
    website: string;
    username?: string;
    password: string;
}
export type PasswordItem = {
    id:string | undefined
    website: string;
    password: string;
    isVisible: boolean;
    username? :string;
};


  