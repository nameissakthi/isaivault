import * as FileSystem from "expo-file-system/legacy";
import { getAudioMetadata } from "@missingcore/audio-metadata";
import MusicInfo from "expo-music-info-2";
import { getDriveAudioSource } from "./driveService";

const metadataCache = new Map();

const getText = (...values) => {
    for (const value of values) {
        if (typeof value === "string" && value.trim()) {
            return value.trim();
        }

        if (typeof value === "number" && Number.isFinite(value)) {
            return String(value);
        }
    }

    return "";
};

const getLocalAudioFile = async music => {
    const directory = FileSystem.cacheDirectory;

    if (!directory) {
        throw new Error("Audio cache directory is unavailable.");
    }

    const localUri = `${directory}isai-metadata-${music.id}.mp3`;
    const info = await FileSystem.getInfoAsync(localUri);

    if (info.exists && info.size > 0) {
        return localUri;
    }

    const source = await getDriveAudioSource(music.id);

    const download = await FileSystem.downloadAsync(
        source.uri,
        localUri,
        {
            headers: source.headers
        }
    );

    if (
        download.status < 200 ||
        download.status >= 300
    ) {
        throw new Error(
            `Audio download failed with status ${download.status}.`
        );
    }

    const downloadedInfo = await FileSystem.getInfoAsync(
        download.uri
    );

    if (!downloadedInfo.exists || !downloadedInfo.size) {
        throw new Error("The downloaded audio file is empty.");
    }

    return download.uri;
};

const saveArtworkLocally = async (artwork, musicId) => {
    if (typeof artwork !== "string" || !artwork.trim()) {
        return null;
    }

    const value = artwork.trim();

    if (/^(https?:|file:\/\/)/i.test(value)) {
        return value;
    }

    const dataUriMatch = value.match(
        /^data:image\/([a-zA-Z0-9.+-]+);base64,([\s\S]+)$/i
    );

    const base64 = dataUriMatch
        ? dataUriMatch[2].replace(/\s/g, "")
        : value.replace(/\s/g, "");

    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(base64) || base64.length < 16) {
        return null;
    }

    const mimeSubtype = dataUriMatch?.[1]?.toLowerCase() || "jpeg";
    const extension = mimeSubtype === "jpeg"
        ? "jpg"
        : mimeSubtype.replace(/[^a-z0-9]/g, "") || "jpg";
    const directory = FileSystem.cacheDirectory;

    if (!directory) {
        return null;
    }

    const localUri = `${directory}isai-artwork-${musicId}.${extension}`;
    const info = await FileSystem.getInfoAsync(localUri);

    if (!info.exists || !info.size) {
        await FileSystem.writeAsStringAsync(localUri, base64, {
            encoding: FileSystem.EncodingType.Base64
        });
    }

    return localUri;
};

const readMetadata = async (localUri, musicId) => {
    const [audioResult, musicInfoResult] = await Promise.allSettled([
        getAudioMetadata(localUri, [
            "album",
            "albumArtist",
            "artist",
            "name",
            "track",
            "year",
            "artwork"
        ]),
        MusicInfo.getMusicInfoAsync(localUri, {
            title: true,
            artist: true,
            album: true,
            genre: true,
            picture: true
        })
    ]);

    const tags = audioResult.status === "fulfilled"
        ? audioResult.value?.metadata ?? {}
        : {};

    const musicInfo = musicInfoResult.status === "fulfilled"
        ? musicInfoResult.value ?? {}
        : {};

    if (audioResult.status === "rejected") {
        console.warn(
            "Primary audio metadata reader failed:",
            audioResult.reason?.message ?? audioResult.reason
        );
    }

    if (musicInfoResult.status === "rejected") {
        console.warn(
            "Secondary audio metadata reader failed:",
            musicInfoResult.reason?.message ?? musicInfoResult.reason
        );
    }

    let artwork = null;

    if (
        typeof tags.artwork === "string" &&
        tags.artwork.length > 0
    ) {
        artwork = tags.artwork.startsWith("data:")
            ? tags.artwork
            : `data:image/jpeg;base64,${tags.artwork}`;
    } else {
        artwork = musicInfo.picture?.pictureData ?? null;
    }

    artwork = await saveArtworkLocally(artwork, musicId);

    return {
        title: getText(
            musicInfo.title,
            tags.name
        ),
        artist: getText(
            musicInfo.artist,
            tags.artist
        ),
        album: getText(
            musicInfo.album,
            tags.album
        ),
        albumArtist: getText(
            tags.albumArtist
        ),
        genre: getText(
            musicInfo.genre
        ),
        year: getText(
            tags.year
        ),
        track: tags.track ?? null,
        artwork,
        contributingArtists: getText(
            tags.artist,
            musicInfo.artist
        )
    };
};

export const getDriveMusicMetadata = async music => {
    if (!music?.id) {
        return music;
    }

    if (metadataCache.has(music.id)) {
        return metadataCache.get(music.id);
    }

    const request = (async () => {
        try {
            const localUri = await getLocalAudioFile(music);
            const metadata = await readMetadata(localUri, music.id);

            const title = getText(
                metadata.title,
                music.title,
                music.name
            );

            const artist = getText(
                metadata.artist,
                music.artist
            );

            return {
                ...music,
                name: title || music.name || "Unknown song",
                title: title || "Unknown song",
                artist: artist || "Unknown artist",
                album: metadata.album || music.album || "",
                albumArtist:
                    metadata.albumArtist ||
                    music.albumArtist ||
                    "",
                genre: metadata.genre || music.genre || "",
                year: metadata.year || music.year || "",
                track: metadata.track ?? music.track ?? null,
                artwork: metadata.artwork || music.artwork || null,
                contributingArtists:
                    metadata.contributingArtists ||
                    music.contributingArtists ||
                    artist ||
                    ""
            };
        } catch (error) {
            console.warn(
                "Unable to read embedded music metadata:",
                error.message
            );

            return {
                ...music,
                title: music.title || music.name || "Unknown song",
                artist: music.artist || "Unknown artist",
                album: music.album || "",
                albumArtist: music.albumArtist || "",
                genre: music.genre || "",
                year: music.year || "",
                track: music.track ?? null,
                artwork: music.artwork || null,
                contributingArtists:
                    music.contributingArtists ||
                    music.artist ||
                    ""
            };
        }
    })();

    metadataCache.set(music.id, request);

    try {
        return await request;
    } catch (error) {
        metadataCache.delete(music.id);
        throw error;
    }
};
