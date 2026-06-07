export const searchLyrics = async (keyword: string) => {
  const params = new URLSearchParams({ q: keyword });
  const response = await fetch(`https://lrclib.net/api/search?${params.toString()}`, {
    headers: {
      "User-Agent": "MusicPlayerAPI/1.0.0 (https://github.com/mattz/music-player-api)"
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch lyrics from LRCLIB");
  }

  const data = await response.json();
  if (Array.isArray(data) && data.length > 0) {
    // Return the best match (first result)
    const bestMatch = data[0];
    return {
      id: bestMatch.id,
      trackName: bestMatch.trackName,
      artistName: bestMatch.artistName,
      albumName: bestMatch.albumName,
      duration: bestMatch.duration,
      plainLyrics: bestMatch.plainLyrics,
      syncedLyrics: bestMatch.syncedLyrics,
    };
  }

  return null;
};
