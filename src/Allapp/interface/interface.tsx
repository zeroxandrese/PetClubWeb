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

export interface Tokens {
    idTBOrigin: string,
    token: string,
    created: string
}

export interface GetTokens {
    resp: Tokens[]
}

export interface ElementResponseData {
    uid: string,
    count: number,
    statusCount: boolean
}

export interface GenericUid {
    uid: string
}

export interface BusinessRegisterResponse {
    uid: string,
    typeUser: string,
    name: string,
    latitude: number,
    longitude: number,
    image: string,
    weekOpening: string,
    weekClosing: string,
    dateAttentionWeek: string,
    weekendOpening: string,
    weekendClosing: string,
    dateAttentionWeekend: string,
    phone: number
    email: string,
    approved: boolean,
    created: string,
    lastUpdated: string,
    status: boolean
}

export interface BusinessRegisterData {
    typeUser: string;
    name: string;
    latitude: number;
    longitude: number;
    image?: File | null;
    weekOpening: string;
    weekClosing: string;
    dateAttentionWeek: string;
    weekendOpening: string;
    weekendClosing: string;
    dateAttentionWeekend: string;
    phone: string;
    email: string;
}