export interface User {
    id: string;
    name: string;
    lead: string;
    password?: string | null;
};

export interface LoginData {
    name: string,
    password: string
};

export interface LoginResponse {
    responseLogin: {
        user: User,
        token: string,
        message: string
    }
}

export interface Tokens{
    idTBOrigin: string,
    token: string,
    created: string
}

export interface GetTokens{
    resp: Tokens[]
}

export interface ElementResponseData{
    uid: string,
    count: number,
    statusCount: boolean
}