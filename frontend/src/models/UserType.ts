export type UserProfile = {
    email: string,
    username: string,
    firstName: string,
    lastName: string,
    _id: string,
    profilePicture: string
    premium: boolean
}

export type EditUserProfile = {
    firstName: string,
    lastName: string,
    profilePicture: File | null;
}

export type EditUserProfileErrors = {
    firstName? : string,
    lastName? : string
}

export type UserProfileToken = {
    email: string,
    username: string,
    firstName: string,
    lastName: string,
    _id: string,
    token: string,
    profilePicture: string
    premium: boolean
}