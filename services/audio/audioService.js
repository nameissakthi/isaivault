const DRIVE_API_URL = "https://www.googleapis.com/drive/v3";

export const getDriveAudioUrl = (fileId, accessToken) => {
    return `${DRIVE_API_URL}/files/${fileId}?alt=media`;
}

export const getDriveAudioHeaders = (accessToken) => {
    return {
        Authorization : `Bearer ${accessToken}`;
    }
}