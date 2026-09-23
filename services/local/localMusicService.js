import {
    File,
    Paths
} from "expo-file-system";

import {
    StorageAccessFramework
} from "expo-file-system/legacy";

import {
    getDriveAudioSource
} from "../drive/driveService";

const DOWNLOAD_FOLDER_NAME = "Download";

const sanitizeFileName = (name) => {
    return name
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
        .trim();
};

export const downloadMusicToLocal = async (
    music
) => {
    if (!music?.id) {
        throw new Error("Music file is required");
    }

    console.log(
        "DOWNLOAD STEP 1: Starting",
        music
    );

    const source =
        await getDriveAudioSource(
            music.id
        );

    console.log(
        "DOWNLOAD STEP 2: Drive source",
        source.uri
    );

    const fileName =
        sanitizeFileName(
            music.name ||
            `${music.id}.mp3`
        );

    console.log(
        "DOWNLOAD STEP 3: File name",
        fileName
    );

    const downloadFolderUri =
        StorageAccessFramework.getUriForDirectoryInRoot(
            DOWNLOAD_FOLDER_NAME
        );

    console.log(
        "DOWNLOAD STEP 4: Download folder URI",
        downloadFolderUri
    );

    const permissions =
        await StorageAccessFramework.requestDirectoryPermissionsAsync(
            downloadFolderUri
        );

    if (!permissions.granted) {
        throw new Error(
            "Permission to access the Download folder was denied."
        );
    }

    console.log(
        "DOWNLOAD STEP 5: Download folder permission granted"
    );

    const downloadDirectoryUri =
        permissions.directoryUri;

    console.log(
        "DOWNLOAD STEP 6: Selected directory",
        downloadDirectoryUri
    );

    const existingFiles =
        await StorageAccessFramework.readDirectoryAsync(
            downloadDirectoryUri
        );

    const existingFile =
        existingFiles.find(
            file =>
                file.endsWith(
                    `/${fileName}`
                ) ||
                file.endsWith(
                    `%2F${encodeURIComponent(fileName)}`
                )
        );

    if (existingFile) {
        console.log(
            "DOWNLOAD STEP 7: Existing file found",
            existingFile
        );

        await StorageAccessFramework.deleteAsync(
            existingFile
        );

        console.log(
            "DOWNLOAD STEP 8: Existing file deleted"
        );
    }

    const fileUri =
        await StorageAccessFramework.createFileAsync(
            downloadDirectoryUri,
            fileName,
            music.mimeType ||
                "audio/mpeg"
        );

    console.log(
        "DOWNLOAD STEP 9: File created",
        fileUri
    );

    const temporaryDirectory =
        new File(
            Paths.cache,
            "IsaiVaultDownloads"
        );

    const temporaryDirectoryUri =
        temporaryDirectory.uri;

    console.log(
        "DOWNLOAD STEP 10: Temporary directory",
        temporaryDirectoryUri
    );

    const temporaryFile =
        new File(
            Paths.cache,
            "IsaiVaultDownloads",
            fileName
        );

    const temporaryParent =
        temporaryFile.parentDirectory;

    if (!temporaryParent.exists) {
        temporaryParent.create({
            idempotent: true,
            intermediates: true
        });
    }

    console.log(
        "DOWNLOAD STEP 11: Temporary file",
        temporaryFile.uri
    );

    const downloadedFile =
        await File.downloadFileAsync(
            source.uri,
            temporaryFile,
            {
                headers: source.headers,
                idempotent: true
            }
        );

    console.log(
        "DOWNLOAD STEP 12: Download completed",
        downloadedFile.uri
    );

    const fileData =
        await downloadedFile.bytes();

    console.log(
        "DOWNLOAD STEP 13: File bytes loaded",
        fileData.length
    );

    const outputFile =
        new File(fileUri);

    outputFile.write(fileData);

    console.log(
        "DOWNLOAD STEP 14: File written to Download",
        fileUri
    );

    if (temporaryFile.exists) {
        temporaryFile.delete();
    }

    console.log(
        "DOWNLOAD STEP 15: Temporary file deleted"
    );

    return fileUri;
};