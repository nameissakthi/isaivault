import { useEffect, useState } from "react";
import {
    ScrollView,
    useColorScheme,
    View,
    Pressable,
} from "react-native";

import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { useRouter } from "expo-router";

import {
    ThemedText,
    ThemedView,
} from "../../components/components";

import { useLibrary } from "../../context/LibraryContext";
import Colors from "../../constants/Colors";


const index = () => {

    const [folderList, setFolderList] = useState([]);
    const [isSelectingMusicFolder, setIsSelectingMusicFolder] = useState(false);

    const {
        selectRootFolder,
        selectMusicFolder,
        getGoogleDriveFolders,
        getGoogleDriveFoldersInside
    } = useLibrary();

    const router = useRouter();

    const theme = useColorScheme();
    const colors = theme === "dark"
        ? Colors.dark
        : Colors.light;

    const isDark = theme === "dark";


    const onFolderSelected = async (folder) => {
        try {

            if (!isSelectingMusicFolder) {

                await selectRootFolder(folder);

                const childFolders =
                    await getGoogleDriveFoldersInside(folder.id);

                setFolderList(childFolders);
                setIsSelectingMusicFolder(true);

                return;
            }

            await selectMusicFolder(folder);

            router.replace("/(tabs)");

        } catch (error) {
            console.log(error.message);
        }
    };


    const goBackToRootFolder = async () => {
        try {

            const folders = await getGoogleDriveFolders();

            setFolderList(folders);
            setIsSelectingMusicFolder(false);

        } catch (error) {
            console.log(error.message);
        }
    };


    useEffect(() => {

        const loadFolderList = async () => {
            try {

                const response = await getGoogleDriveFolders();

                setFolderList(response);

            } catch (error) {
                console.log(error.message);
            }
        };

        loadFolderList();

    }, []);


    return (
        <ThemedView
            safe
            style={{
                flex: 1,
            }}
        >

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingTop: 28,
                    paddingBottom: 40,
                }}
            >

                {/* Header */}
                <ThemedView
                    style={{
                        alignItems: "center",
                        marginBottom: 25,
                    }}
                >

                    <View
                        style={{
                            width: 58,
                            height: 58,
                            borderRadius: 18,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: colors.elevated,

                            borderWidth: 1,
                            borderColor: isDark
                                ? "rgba(255,255,255,0.07)"
                                : "rgba(0,0,0,0.06)",
                        }}
                    >
                        <MaterialDesignIcons
                            name={
                                isSelectingMusicFolder
                                    ? "music-box-multiple"
                                    : "folder-music"
                            }
                            size={29}
                            color={colors.text}
                        />
                    </View>


                    <ThemedText
                        style={{
                            fontSize: 25,
                            fontWeight: "800",
                            marginTop: 14,
                        }}
                    >
                        {isSelectingMusicFolder
                            ? "Select Music Folder"
                            : "Select Root Folder"
                        }
                    </ThemedText>


                    <ThemedText
                        style={{
                            fontSize: 14,
                            opacity: 0.55,
                            textAlign: "center",
                            marginTop: 7,
                            lineHeight: 20,
                        }}
                    >
                        {isSelectingMusicFolder
                            ? "Choose the folder where your music is stored."
                            : "Choose the main folder from your Google Drive."
                        }
                    </ThemedText>

                </ThemedView>


                {/* Folder List */}
                <ThemedView
                    style={{
                        backgroundColor: colors.elevated,
                        borderRadius: 20,
                        padding: 10,

                        borderWidth: 1,
                        borderColor: isDark
                            ? "rgba(255,255,255,0.06)"
                            : "rgba(0,0,0,0.06)",
                    }}
                >

                    <ScrollView
                        nestedScrollEnabled
                        showsVerticalScrollIndicator={false}
                        style={{
                            maxHeight: 480,
                        }}
                    >

                        {folderList.length > 0 ? (

                            folderList.map((folder) => (

                                <Pressable
                                    key={folder.id}
                                    onPress={() =>
                                        onFolderSelected(folder)
                                    }
                                    style={({ pressed }) => ({
                                        minHeight: 64,

                                        flexDirection: "row",
                                        alignItems: "center",

                                        paddingHorizontal: 12,
                                        marginVertical: 4,

                                        borderRadius: 14,

                                        backgroundColor:
                                            colors.surface,

                                        borderWidth: 1,
                                        borderColor: isDark
                                            ? "rgba(255,255,255,0.04)"
                                            : "rgba(0,0,0,0.04)",

                                        opacity: pressed ? 0.65 : 1,
                                    })}
                                >

                                    {/* Folder Icon */}
                                    <View
                                        style={{
                                            width: 42,
                                            height: 42,
                                            borderRadius: 12,

                                            alignItems: "center",
                                            justifyContent: "center",

                                            backgroundColor:
                                                colors.elevated,

                                            marginRight: 12,
                                        }}
                                    >
                                        <MaterialDesignIcons
                                            name="folder-music"
                                            size={23}
                                            color={colors.text}
                                        />
                                    </View>


                                    {/* Folder Name */}
                                    <ThemedText
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                        style={{
                                            flex: 1,
                                            fontSize: 15,
                                            fontWeight: "600",
                                        }}
                                    >
                                        {folder.name}
                                    </ThemedText>


                                    {/* Arrow */}
                                    <MaterialDesignIcons
                                        name="chevron-right"
                                        size={24}
                                        color={colors.textSecondary}
                                    />

                                </Pressable>

                            ))

                        ) : (

                            <View
                                style={{
                                    paddingVertical: 50,
                                    alignItems: "center",
                                }}
                            >
                                <MaterialDesignIcons
                                    name="folder-open-outline"
                                    size={40}
                                    color={colors.textSecondary}
                                />

                                <ThemedText
                                    style={{
                                        marginTop: 12,
                                        opacity: 0.55,
                                    }}
                                >
                                    No folders found
                                </ThemedText>
                            </View>

                        )}

                    </ScrollView>

                </ThemedView>


                {/* Back Button */}
                {isSelectingMusicFolder && (

                    <Pressable
                        onPress={goBackToRootFolder}
                        style={({ pressed }) => ({
                            height: 54,

                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",

                            marginTop: 16,

                            borderRadius: 100,

                            backgroundColor: colors.elevated,

                            borderWidth: 1,
                            borderColor: isDark
                                ? "rgba(255,255,255,0.07)"
                                : "rgba(0,0,0,0.06)",

                            opacity: pressed ? 0.7 : 1,
                        })}
                    >

                        <MaterialDesignIcons
                            name="arrow-left"
                            size={20}
                            color={colors.text}
                        />

                        <ThemedText
                            style={{
                                fontWeight: "700",
                                marginLeft: 8,
                            }}
                        >
                            Back to Root Folders
                        </ThemedText>

                    </Pressable>

                )}


                {/* Bottom Hint */}
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",

                        marginTop: 22,
                        paddingHorizontal: 15,
                    }}
                >

                    <MaterialDesignIcons
                        name="information-outline"
                        size={16}
                        color={colors.textSecondary}
                    />

                    <ThemedText
                        style={{
                            fontSize: 12,
                            opacity: 0.45,
                            marginLeft: 6,
                            textAlign: "center",
                        }}
                    >
                        {isSelectingMusicFolder
                            ? "Only folders inside your selected root folder are shown."
                            : "You can change this folder later from Settings."
                        }
                    </ThemedText>

                </View>

            </ScrollView>

        </ThemedView>
    );
};


export default index;