import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDriveFolders } from "../services/drive/driveService";

const { createContext, useContext, useState, useEffect } = require("react");

const LibraryContext = createContext();

const ASYNC_STORAGE_FOLDER_KEY_NAME = "music_folder";

const LibraryProvider = ({ children }) => {

    const [musicFolder, setMusicFolder] = useState(null);
    const [isLibraryLoading, setIsLibraryLoading] = useState(true);

    useEffect(() => {
        const loadLibrary = async () => {
            try {
                const folder = await AsyncStorage.getItem(ASYNC_STORAGE_FOLDER_KEY_NAME);

                if (folder !== null) setMusicFolder(JSON.parse(folder));
            } catch (error) {
                console.log(error.message);
            } finally {
                setIsLibraryLoading(false);
            }
        };

        loadLibrary();
    }, [])

    const getGoogleDriveFolders = async () => {
        try {
            setIsLibraryLoading(true);
            
            const response = await getDriveFolders();

            return response;
        } catch (error) {
            console.log(error.message);
        } finally {
            setIsLibraryLoading(false);
        }
    };


    const value = {
        musicFolder, setMusicFolder, isLibraryLoading,
        getGoogleDriveFolders
    }

    return (
        <LibraryContext.Provider value={value}>
            {children}
        </LibraryContext.Provider>
    )
}

const useLibrary = () => {
    const context = useContext(LibraryContext);

    if (!context) throw new Error("LibraryContext should be used within LibraryProvider");

    return context;
}

export {
    LibraryProvider,
    useLibrary,
    ASYNC_STORAGE_FOLDER_KEY_NAME
}