export interface MessageItem {
  id: string;
  message: string;
  status: 'local' | 'ai';
  loading?: boolean;
}
