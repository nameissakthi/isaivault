import { GoogleSignin } from "@react-native-google-signin/google-signin";

const DRIVE_API_URL = "https://www.googleapis.com/drive/v3";

export const getDriveFiles = async () => {

    try {

        const { accessToken } = (await GoogleSignin.getTokens());
        
        const response = await fetch(`${DRIVE_API_URL}/files?pageSize=20&fields=files(id,name,mimeType,size,webContentLink)`, {
            headers : {
                Authorization : `Bearer ${accessToken}`
            }
        });

        if(!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }

        const data = await response.json();

        return data.files;
    } catch (error) {
        console.error("Error Occured While Trying To Access Google Drive Files : ", error.message);
        throw new Error(error.message);
    }
};

export const getDriveFolders = async () => {
    try {
        const data = [
            {"id": "1OCTgG-kxTKm643KqkvQbMh3_fpyshRkP", "mimeType": "application/vnd.google-apps.folder", "name": "music"},
            {"id": "1OCTgG-kxTKm643KqkvQbMh3_fpyshRkH", "mimeType": "application/vnd.google-apps.folder", "name": "docs"},
            {"id": "1OCTgG-kxTKm643KqkvQbMh3_fpyshRkJ", "mimeType": "application/vnd.google-apps.folder", "name": "pic"},
            {"id": "1OCTgG-kxTKm643KqkvQbMh3_fpyshRkK", "mimeType": "application/vnd.google-apps.folder", "name": "movies"},
        ];

        return data;
    } catch (error) {
        console.error("Error Occured While Trying To Retrive Drive Folder List : ", error.message);
        throw new Error(error.message);
    }
};