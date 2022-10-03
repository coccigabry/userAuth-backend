export interface localUserInterface {
    username: string;
    isAdmin: boolean;
    id: string;
}

export interface IMongoDBlocalUser {
    username: string;
    password: string;
    isAdmin: boolean;
    _id: string;
}
