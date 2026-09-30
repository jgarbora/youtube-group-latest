export interface Category {
  name: string;
  slug: string;
  channels: string[];
}

export interface ChannelsConfig {
  categories: Category[];
}

export interface Video {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string;
  channelTitle: string;
}

export interface AggregatorResult {
  videos: Video[];
  errors: ChannelError[];
}

export interface ChannelError {
  channelId: string;
  message: string;
}
