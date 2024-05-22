import { UserProfile } from "./UserType";

export interface CommentType {
    _id: string;
    content: string;
    videoId: string;
    userId: UserProfile;
    parentId?: string;
    createdAt: string;
    updatedAt: string;
    replies: CommentType[];
}