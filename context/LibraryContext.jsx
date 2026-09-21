import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDriveFolders, getDriveFoldersInside } from "../services/drive/driveService";

const { createContext, useContext, useState, useEffect } = require("react");

const LibraryContext = createContext();

const ASYNC_STORAGE_FOLDER_KEY_NAME = "root_folder";
const ASYNC_STORAGE_MUSIC_FOLDER_KEY_NAME = "music_folder";

const LibraryProvider = ({ children }) => {

    const [rootFolder, setRootFolder] = useState(null);
    const [musicFolder, setMusicFolder] = useState(null);
    const [isLibraryLoading, setIsLibraryLoading] = useState(true);

    useEffect(() => {
        const loadLibrary = async () => {
            try {
                const rootFolder = await AsyncStorage.getItem(ASYNC_STORAGE_FOLDER_KEY_NAME);
                const musicFolder = await AsyncStorage.getItem(ASYNC_STORAGE_MUSIC_FOLDER_KEY_NAME);

                if (rootFolder !== null) setRootFolder(JSON.parse(rootFolder));
                if (musicFolder !== null) setMusicFolder(JSON.parse(musicFolder));
            } catch (error) {
                console.log(error.message);
            } finally {
                setIsLibraryLoading(false);
            }
        };

        loadLibrary();
    }, []);

    const selectRootFolder = async (folder) => {
        try {
			await AsyncStorage.setItem(ASYNC_STORAGE_FOLDER_KEY_NAME, JSON.stringify(folder));
			setRootFolder(folder);
		} catch (error) {
			throw new Error(error.message);
		}
    }

    const selectMusicFolder = async (folder) => {
        try {
            await AsyncStorage.setItem(ASYNC_STORAGE_MUSIC_FOLDER_KEY_NAME, JSON.stringify(folder));
            setMusicFolder(folder);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    const getGoogleDriveFoldersInside = async (parentFolderId) => {
        try {
            return await getDriveFoldersInside(parentFolderId);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    const removeFolderInfo = async () => {
        try {
            await AsyncStorage.removeItem(ASYNC_STORAGE_FOLDER_KEY_NAME);
            setRootFolder(null);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    const getGoogleDriveFolders = async () => {
        try {
            const response = await getDriveFolders();
            return response;
        } catch (error) {
            throw new Error(error.message);
        }
    };


    const value = {
        rootFolder, setRootFolder, 
        
        isLibraryLoading, removeFolderInfo, rootFolderFound : rootFolder !== null,
        
        selectRootFolder, selectMusicFolder, musicFolder,

        getGoogleDriveFoldersInside, getGoogleDriveFolders,
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