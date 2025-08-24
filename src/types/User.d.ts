export interface User{
    id: string;
    name: string;
    email: string;
    password: string;
}

export interface CreateUserDTO{
    name: string;
    email: string;
    password: string;
}

export interface LoginUserDTO{
    email: string;
    password: string;
}