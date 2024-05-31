import { UserProfile } from "./UserType";

export interface Video {
  _id: string;
  url: string;
  title: string;
  description: string;
  thumbnail?: string;
  subtitles?: string;
  topic: string;
  createdAt: string;
  user: UserProfile;
}
