export interface oauthUserInterface {
    googleId?: string;
    facebookId?: string;
    username: string;
    isAdmin: boolean;
    id: string;
}


export interface IMongoDBoauthUser {
    googleId?: string;
    facebookId?: string;
    username: string;
    isAdmin: boolean;
    __v: number;
    _id: string;
}

