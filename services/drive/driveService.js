import {
    getGoogleDriveToken
} from "../auth/authService";

const DRIVE_API_URL =
    "https://www.googleapis.com/drive/v3";

const DRIVE_UPLOAD_URL =
    "https://www.googleapis.com/upload/drive/v3";

const ISAI_VAULT_FOLDER_NAME =
    "IsaiVault";

const PLAYLIST_FILE_NAME =
    "playlists.json";

export const getDriveFolders = async () => {
    const { accessToken } =
        await getGoogleDriveToken();

    const query = encodeURIComponent(
        "mimeType = 'application/vnd.google-apps.folder' and trashed = false"
    );

    const response = await fetch(
        `${DRIVE_API_URL}/files?q=${query}&pageSize=100&fields=files(id,name,mimeType)`,
        {
            headers: {
                Authorization:
                    `Bearer ${accessToken}`
            }
        }
    );

    if (!response.ok) {
        throw new Error(
            await response.text()
        );
    }

    const data =
        await response.json();

    return data.files;
};

export const getDriveFoldersInside = async (
    parentFolderId
) => {
    const { accessToken } =
        await getGoogleDriveToken();

    const query = encodeURIComponent(
        `'${parentFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
    );

    const response = await fetch(
        `${DRIVE_API_URL}/files?q=${query}&pageSize=100&fields=files(id,name,mimeType)`,
        {
            headers: {
                Authorization:
                    `Bearer ${accessToken}`
            }
        }
    );

    if (!response.ok) {
        throw new Error(
            await response.text()
        );
    }

    const data =
        await response.json();

    return data.files;
};

export const getDriveFiles = async (
    folderId
) => {
    const { accessToken } =
        await getGoogleDriveToken();

    const query = encodeURIComponent(
        `'${folderId}' in parents`
    );

    const response = await fetch(
        `${DRIVE_API_URL}/files?q=${query}&pageSize=100&fields=files(id,name,mimeType,size,webContentLink)`,
        {
            headers: {
                Authorization:
                    `Bearer ${accessToken}`
            }
        }
    );

    if (!response.ok) {
        throw new Error(
            await response.text()
        );
    }

    const data =
        await response.json();

    return data.files.filter(
        file =>
            file.mimeType &&
            file.mimeType.startsWith("audio/")
    );
};

export const getDriveAudioSource = async (
    fileId
) => {
    const { accessToken } =
        await getGoogleDriveToken();

    return {
        uri:
            `${DRIVE_API_URL}/files/${fileId}?alt=media`,
        headers: {
            Authorization:
                `Bearer ${accessToken}`
        }
    };
};

const findIsaiVaultFolder = async (
    accessToken
) => {
    const query = encodeURIComponent(
        `name = '${ISAI_VAULT_FOLDER_NAME}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
    );

    const response = await fetch(
        `${DRIVE_API_URL}/files?q=${query}&pageSize=10&fields=files(id,name,mimeType)`,
        {
            headers: {
                Authorization:
                    `Bearer ${accessToken}`
            }
        }
    );

    if (!response.ok) {
        throw new Error(
            await response.text()
        );
    }

    const data =
        await response.json();

    return data.files[0] ?? null;
};

const createIsaiVaultFolder = async (
    accessToken
) => {
    const response = await fetch(
        `${DRIVE_API_URL}/files`,
        {
            method: "POST",

            headers: {
                Authorization:
                    `Bearer ${accessToken}`,
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({
                name:
                    ISAI_VAULT_FOLDER_NAME,
                mimeType:
                    "application/vnd.google-apps.folder"
            })
        }
    );

    if (!response.ok) {
        throw new Error(
            await response.text()
        );
    }

    return await response.json();
};

export const getOrCreateIsaiVaultFolder =
    async () => {
        const { accessToken } =
            await getGoogleDriveToken();

        const existingFolder =
            await findIsaiVaultFolder(
                accessToken
            );

        if (existingFolder) {
            return existingFolder;
        }

        return await createIsaiVaultFolder(
            accessToken
        );
    };

const findPlaylistsFile = async (
    accessToken,
    folderId
) => {
    const query = encodeURIComponent(
        `name = '${PLAYLIST_FILE_NAME}' and '${folderId}' in parents and trashed = false`
    );

    const response = await fetch(
        `${DRIVE_API_URL}/files?q=${query}&pageSize=10&fields=files(id,name,mimeType)`,
        {
            headers: {
                Authorization:
                    `Bearer ${accessToken}`
            }
        }
    );

    if (!response.ok) {
        throw new Error(
            await response.text()
        );
    }

    const data =
        await response.json();

    return data.files[0] ?? null;
};

export const getDrivePlaylists =
    async () => {
        const { accessToken } =
            await getGoogleDriveToken();

        const folder =
            await getOrCreateIsaiVaultFolder();

        const file =
            await findPlaylistsFile(
                accessToken,
                folder.id
            );

        if (!file) {
            return [];
        }

        const response = await fetch(
            `${DRIVE_API_URL}/files/${file.id}?alt=media`,
            {
                headers: {
                    Authorization:
                        `Bearer ${accessToken}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(
                await response.text()
            );
        }

        const text =
            await response.text();

        if (!text) {
            return [];
        }

        return JSON.parse(text);
    };

export const saveDrivePlaylists = async (playlists) => {
    const { accessToken } =
        await getGoogleDriveToken();

    const folder =
        await getOrCreateIsaiVaultFolder();

    const existingFile =
        await findPlaylistsFile(
            accessToken,
            folder.id
        );

    const metadata = existingFile
        ? {
            name: PLAYLIST_FILE_NAME,
            mimeType: "application/json"
        }
        : {
            name: PLAYLIST_FILE_NAME,
            mimeType: "application/json",
            parents: [folder.id]
        };

    const content =
        JSON.stringify(
            playlists,
            null,
            2
        );

    const boundary =
        "-------IsaiVaultBoundary";

    const body =
        `--${boundary}\r\n` +
        "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
        `${JSON.stringify(metadata)}\r\n` +
        `--${boundary}\r\n` +
        "Content-Type: application/json\r\n\r\n" +
        `${content}\r\n` +
        `--${boundary}--`;

    const url = existingFile
        ? `${DRIVE_UPLOAD_URL}/files/${existingFile.id}?uploadType=multipart`
        : `${DRIVE_UPLOAD_URL}/files?uploadType=multipart`;

    const response = await fetch(
        url,
        {
            method: existingFile ? "PATCH" : "POST",
            headers: {
                Authorization:
                    `Bearer ${accessToken}`,
                "Content-Type":
                    `multipart/related; boundary=${boundary}`
            },
            body
        }
    );

    if (!response.ok) {
        throw new Error(
            await response.text()
        );
    }

    return await response.json();
};

export const deleteDriveFile = async (
    fileId
) => {
    if (!fileId) {
        throw new Error(
            "File ID is required"
        );
    }

    const { accessToken } =
        await getGoogleDriveToken();

    const response =
        await fetch(
            `${DRIVE_API_URL}/files/${fileId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization:
                        `Bearer ${accessToken}`
                }
            }
        );

    if (!response.ok) {
        throw new Error(
            await response.text()
        );
    }

    return true;
};