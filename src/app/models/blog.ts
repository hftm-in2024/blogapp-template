export interface Blog {
  id: number;
  title: string;
  author: string;
  contentPreview: string;
  headerImageUrl?: string;
  likes: number;
  comments: number;
  likedByMe: boolean;
  createdByMe: boolean;
  createdAt: string;
  updatedAt: string;
}
