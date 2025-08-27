export interface Comment {
  id: string;
  text: string;
  timestamp: number;
  parentId?: string;
  replies: Comment[];
}

export interface CommentsProps {
  onCommentChange?: (comments: Comment[]) => void;
}
