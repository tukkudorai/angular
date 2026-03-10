export interface TweetDto {
  id: string;
  userId: string;
  username: string;
  firstName: string;
  profilePictureUrl: string;
  content: string;
  mediaUrl?: string; // Support for US 08
  createdAt: string;
  likes: number;
  retweets: number;
  replies: number;
}