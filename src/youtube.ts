import { google, youtube_v3 } from "googleapis";
import { config } from "./config";
import { Video } from "./types";

const youtube = google.youtube({
  version: "v3",
  auth: config.youtubeApiKey,
});

export async function getUploadsPlaylistId(
  channelId: string
): Promise<string> {
  const response = await youtube.channels.list({
    part: ["contentDetails"],
    id: [channelId],
  });

  const channel = response.data.items?.[0];
  if (!channel) {
    throw new Error(`Channel not found: ${channelId}`);
  }

  const playlistId =
    channel.contentDetails?.relatedPlaylists?.uploads;
  if (!playlistId) {
    throw new Error(
      `Uploads playlist not found for channel: ${channelId}`
    );
  }

  return playlistId;
}

/**
 * Every channel's uploads playlist is "UU" + channelId.slice(2). YouTube also
 * exposes sibling playlists with the same suffix: "UULF" (long-form videos
 * only, no Shorts) and "UUSH" (Shorts only). Using UULF excludes Shorts at no
 * extra quota cost. A channel with no long-form videos has no UULF playlist
 * and returns 404.
 */
function longFormPlaylistId(channelId: string): string {
  return "UULF" + channelId.slice(2);
}

function isNotFound(error: unknown): boolean {
  return (
    error instanceof Error &&
    "code" in error &&
    (error as { code: number }).code === 404
  );
}

export async function getRecentVideos(
  channelId: string,
  maxResults: number = 10
): Promise<Video[]> {
  try {
    let items: youtube_v3.Schema$PlaylistItem[];

    if (config.includeShorts) {
      const playlistId = await getUploadsPlaylistId(channelId);
      const response = await youtube.playlistItems.list({
        part: ["snippet"],
        playlistId,
        maxResults,
      });
      items = response.data.items ?? [];
    } else {
      try {
        const response = await youtube.playlistItems.list({
          part: ["snippet"],
          playlistId: longFormPlaylistId(channelId),
          maxResults,
        });
        items = response.data.items ?? [];
      } catch (error) {
        if (!isNotFound(error)) throw error;
        // Either the channel has only Shorts, or it doesn't exist at all.
        // Resolve the regular uploads playlist to tell the two apart: this
        // throws "Channel not found" for a bad ID, and otherwise confirms a
        // real channel with nothing but Shorts.
        await getUploadsPlaylistId(channelId);
        items = [];
      }
    }

    return items.map((item) => ({
      id: item.snippet?.resourceId?.videoId ?? "",
      title: item.snippet?.title ?? "",
      description: item.snippet?.description ?? "",
      publishedAt: item.snippet?.publishedAt ?? "",
      thumbnailUrl:
        item.snippet?.thumbnails?.high?.url ??
        item.snippet?.thumbnails?.default?.url ??
        "",
      channelTitle: item.snippet?.channelTitle ?? "",
    }));
  } catch (error: unknown) {
    if (error instanceof Error && "code" in error) {
      const apiError = error as Error & { code: number };
      if (apiError.code === 403) {
        throw new Error("YouTube API daily quota exceeded");
      }
      if (apiError.code === 401) {
        throw new Error(
          `YouTube API authentication error: ${apiError.message}`
        );
      }
    }
    throw error;
  }
}
