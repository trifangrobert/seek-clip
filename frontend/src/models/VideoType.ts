export interface Video {
  _id: string;
  url: string;
  title: string;
  description: string;
  author: string;
  authorId: string;
  thumbnail?: string;
  subtitles?: string;
  topic: string;
  createdAt: string;
  authorUsername: string;
}
