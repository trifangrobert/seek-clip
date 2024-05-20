export interface RegisterFormValues {
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    profilePicture: File | null;
}

export interface RegisterFormErrors {
    email? : string;
    password? : string;
    username? : string;
    firstName? : string;
    lastName? : string;
}

export interface LoginFormValues {
    username: string;
    password: string;
}

export interface LoginFormErrors {
    username? : string;
    password? : string;
}