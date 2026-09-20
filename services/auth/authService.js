import { GoogleSignin } from "@react-native-google-signin/google-signin"

const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

GoogleSignin.configure({
    webClientId : WEB_CLIENT_ID,
    scopes : [
        "https://www.googleapis.com/auth/drive.readonly"
    ]
});

export const restoreGoogleSession = async () => {

    try {

        const response = await GoogleSignin.signInSilently();

        return {
            success : true,
            user : response.data.user
        }
    } catch (error) {
        return {
            success : false,
            user : null,
            message : error.message
        }
    }
};

export const loginWithGoogle = async () => {

    try {

        await GoogleSignin.hasPlayServices({
            showPlayServicesUpdateDialog : true
        })

        const response = await GoogleSignin.signIn();

        return {
            success : true,
            user : response.data.user,
            idToken : response.data.idToken,
        }
    } catch (error) {
        console.error("Google Sign In Error : ", error.message);
        throw new Error(error.message);
    }
};

export const logoutFromGoogle = async () => {
    
    try {
        await GoogleSignin.signOut();
    } catch (error) {
        console.error("Google Logout Error : ", error.message);
        throw new Error(error.message);
    }
};

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