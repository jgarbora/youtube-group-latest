import { getRecentVideos } from "./youtube";
import { AggregatorResult, ChannelError, Video } from "./types";

export async function getLatestVideos(
  channelIds: string[],
  maxResults: number = 10
): Promise<AggregatorResult> {
  const results = await Promise.allSettled(
    channelIds.map((id) => getRecentVideos(id, maxResults))
  );

  const videos: Video[] = [];
  const errors: ChannelError[] = [];

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      videos.push(...result.value);
    } else {
      errors.push({
        channelId: channelIds[index],
        message:
          result.reason instanceof Error
            ? result.reason.message
            : String(result.reason),
      });
    }
  });

  videos.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() -
      new Date(a.publishedAt).getTime()
  );

  return { videos, errors };
}
