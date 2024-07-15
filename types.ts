export type RootStackParamList = {
    ViewPasswords: { info?: string };
    AddPassword:  undefined;
    Authentication:undefined
};
export interface PasswordEntry {
    website: string;
    username?: string;
    password: string;
}
export interface StoredPassword {
    id: string;
    website: string;
    username?: string;
    password: string;
}

  