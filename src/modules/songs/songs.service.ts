import yts from "yt-search";
import YouTube from "youtube-sr";

export const searchSongs = async (keyword: string) => {
  const result = await yts(keyword);
  
  return {
    songs: result.videos.slice(0, 15).map((v) => ({
      id: v.videoId,
      title: v.title,
      duration: v.duration.seconds,
      durationText: v.duration.timestamp,
      author: v.author.name,
      thumbnail: v.thumbnail || "",
      views: v.views,
    })),
    artists: result.channels.slice(0, 5).map((c) => ({
      name: c.name,
      url: c.url,
      thumbnail: c.thumbnail || "",
      // @ts-ignore
      subscribers: c.subCountLabel || null,
    })),
  };
};

export const getSongDetail = async (videoId: string) => {
  try {
    // Add timeout to prevent hanging on invalid IDs
    const video = await Promise.race([
      yts({ videoId }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 8000))
    ]) as any;
    
    if (!video) return null;
    
    return {
      id: video.videoId,
      title: video.title,
      description: video.description,
      duration: video.duration.seconds,
      durationText: video.duration.timestamp,
      author: video.author.name,
      thumbnail: video.thumbnail || "",
      url: video.url,
      views: video.views,
    };
  } catch (err) {
    return null; // Return null on error/timeout so route sends 404
  }
};

export const getTrendingSongs = async () => {
  // Use natural search instead of listId because listId tends to hang in yt-search
  const result = await yts("top hits music official");
  return result.videos.slice(0, 20).map((v) => ({
    id: v.videoId,
    title: v.title,
    duration: v.duration.seconds,
    author: v.author.name,
    thumbnail: v.thumbnail || "",
  }));
};

export const getPlaylistSongs = async (keyword: string) => {
  try {
    const searchResult = await yts({ query: keyword });
    const playlists = searchResult.playlists;
    
    if (!playlists || playlists.length === 0) {
      return null;
    }


    const topPlaylist = playlists[0];

    const listDetail = await Promise.race([
      yts({ listId: topPlaylist.listId }),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 8000))
    ]) as any;

    if (!listDetail || !listDetail.videos) return null;

    return {
      playlistId: topPlaylist.listId,
      title: topPlaylist.title,
      author: topPlaylist.author.name,
      songs: listDetail.videos.slice(0, 30).map((v: any) => ({
        id: v.videoId,
        title: v.title,
        duration: v.duration?.seconds || 0,
        durationText: v.duration?.timestamp || "",
        author: v.author.name,
        thumbnail: v.thumbnail || "",
      })),
    };
  } catch (err) {
    return null;
  }
};

export const getSongSuggestions = async (keyword: string) => {
  try {
    const suggestions = await YouTube.getSuggestions(keyword);
    return suggestions;
  } catch (err) {
    return [];
  }
};

export const getArtistSongs = async (artistName: string) => {
  try {
    const result = await yts(`${artistName} songs`);
    return result.videos.slice(0, 30).map((v) => ({
      id: v.videoId,
      title: v.title,
      duration: v.duration.seconds,
      durationText: v.duration.timestamp,
      author: v.author.name,
      thumbnail: v.thumbnail || "",
      views: v.views,
    }));
  } catch (err) {
    return [];
  }
};
