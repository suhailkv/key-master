export type RootStackParamList = {
    ViewPasswords: undefined;
    AddPassword: undefined;
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

  