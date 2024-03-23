export interface RegisterFormValues {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface RegisterFormErrors {
    email? : string;
    password? : string;
    firstName? : string;
    lastName? : string;
}

export interface LoginFormValues {
    email: string;
    password: string;
}

export interface LoginFormErrors {
    email? : string;
    password? : string;
}