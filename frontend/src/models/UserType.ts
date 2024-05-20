export type UserProfile = {
    email: string,
    username: string,
    firstName: string,
    lastName: string,
    userId: string,
    profilePicture: string
}

export type EditUserProfile = {
    email: string,
    username: string,
    firstName: string,
    lastName: string,
    profilePicture: File | null;
}

export type EditUserProfileErrors = {
    email? : string,
    username? : string,
    firstName? : string,
    lastName? : string
}

export type UserProfileToken = {
    email: string,
    username: string,
    firstName: string,
    lastName: string,
    userId: string,
    token: string,
    profilePicture: string
}