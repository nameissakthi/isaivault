import { GoogleSignin } from "@react-native-google-signin/google-signin";

const DRIVE_API_URL = "https://www.googleapis.com/drive/v3";

export const getGoogleDriveToken = async () => {

    try {
        const tokens = await GoogleSignin.getTokens();

        return {
            success : true,
            accessToken : tokens.accessToken
        }
    } catch (error) {
        console.error("Google Drive Access Token Retrival Error : ", error.message);
        throw new Error(error.message);
    }
};

export const getDriveFiles = async (folderId) => {

    try {

        const { accessToken } = await getGoogleDriveToken();

        const query = encodeURIComponent(
            `'${folderId}' in parents`
        );
        
        const response = await fetch(`${DRIVE_API_URL}/files?q=${query}&pageSize=20&fields=files(id,name,mimeType,size,webContentLink)`, {
            headers : {
                Authorization : `Bearer ${accessToken}`
            }
        });

        if(!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }

        const data = await response.json();

        const musics = data.files.filter(file => file.mimeType.startsWith('audio/'));

        return musics;
    } catch (error) {
        console.error("Error Occured While Trying To Access Google Drive Files : ", error.message);
        throw new Error(error.message);
    }
};

export const getDriveFolders = async () => {
    try {
        const { accessToken } = await getGoogleDriveToken();
    
        const query = encodeURIComponent(
            "mimeType = 'application/vnd.google-apps.folder' and trashed = false"
        )
        

        const response = await fetch(`${DRIVE_API_URL}/files?q=${query}&pageSize=100&fields=files(id,name,mimeType)&orderBy=name`, {
            headers : {
                Authorization : `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }

        const data = await response.json();

        return data.files;
    } catch (error) {
        console.error("Error Occured While Trying To Retrive Drive Folder List : ", error.message);
        throw new Error(error.message);
    }
};

export const getDriveFoldersInside = async (parentFolderId) => {
    try {
        const { accessToken } = await getGoogleDriveToken();
    
        const query = encodeURIComponent(
            `'${parentFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
        );

        const response = await fetch(`${DRIVE_API_URL}/files?q=${query}&pageSize=100&fields=files(id,name,mimeType)&orderBy=name`, {
            headers : {
                Authorization : `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }

        const data = await response.json();

        return data.files;
    } catch (error) {
        console.error("Error Occured While Trying To Retrive Music Folder : ", error.message);
        throw new Error(error.message);
    }
}

export const getDriveAudioSource = async (fileId) => {
    try {
        
        const { accessToken } = await getGoogleDriveToken();

        return {
            uri : `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
            headers : {
                Authorization : `Bearer ${accessToken}`
            }
        };

    } catch (error) {
        console.error("Error Occured While Trying To Retrive Drive Audio Source : ", error.message);
        throw new Error(error.message);
    }
}

export const testDriveAudioAccess = async (fileId) => {
    try {

        const { accessToken } = await getGoogleDriveToken();

        const response = await fetch(
            `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }
        );

        console.log("Audio response:", response.status);

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }

        return true;

    } catch (error) {

        console.error(
            "Drive Audio Access Error:",
            error.message
        );

        throw new Error(error.message);
    }
};