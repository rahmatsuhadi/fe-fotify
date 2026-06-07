import yts from "yt-search";

export const searchSongs = async (keyword: string) => {
  const result = await yts(keyword);
  
  return {
    songs: result.videos.slice(0, 15).map((v) => ({
      id: v.videoId,
      title: v.title,
      duration: v.duration.seconds,
      durationText: v.duration.timestamp,
      author: v.author.name,
      thumbnail: v.thumbnail,
      views: v.views,
    })),
    artists: result.channels.slice(0, 5).map((c) => ({
      name: c.name,
      url: c.url,
      thumbnail: c.thumbnail,
      // @ts-ignore (yt-search types might not strictly define subCountLabel, but it exists)
      subscribers: c.subCountLabel || null,
    })),
  };
};
