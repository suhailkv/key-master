export type RootStackParamList = {
    ViewPasswords: { info?: string };
    AddPassword:  undefined;
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

  