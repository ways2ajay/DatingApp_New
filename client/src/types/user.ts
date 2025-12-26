export type User ={
    id: string;
    displayName: string;
    email:string;
    token:string;
    imageUrl? : string;
}

export type loginCreds ={
    email: string;
    password: string;
}

export type RegisterCreds ={
    email: string;
    displayName: string;
    password: string;
    dateOfBirth: string;
    gender:string;
    city:string;
    country:string;
}