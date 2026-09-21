import { useEffect, useState } from "react";
import { Spacer, ThemedButton, ThemedText, ThemedView } from "../../components/components";
import { useLibrary } from "../../context/LibraryContext";
import { ScrollView, StyleSheet, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import Colors from "../../constants/Colors";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons"

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
	const colors = theme === 'dark' ? Colors.dark : Colors.light;

	const onFolderSelected = async (folder) => {
		try {
			if (!isSelectingMusicFolder) {
				await selectRootFolder(folder);

				const childFolders = await getGoogleDriveFoldersInside(folder.id);

				setFolderList(childFolders);
				setIsSelectingMusicFolder(true);

				return;
			}

			await selectMusicFolder(folder);

			router.replace("/(tabs)");
		} catch (error) {
			console.log(error.message);
		}
	}

	const goBackToRootFolder = async () => {
		try {
			const folders = await getGoogleDriveFolders();

			setFolderList(folders);
			setIsSelectingMusicFolder(false);
		} catch (error) {
			console.log(error.message);
		}
	}

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
	}, [])

	return (
		<ThemedView safe style={{
			flex: 1
		}}>
			<Spacer />
			<ThemedText style={{
				textAlign: "center",
				fontSize: 20,
				fontWeight: 800
			}}>
				{
					isSelectingMusicFolder
						? "Select Music Folder"
						: "Select Root Folder"
				}
			</ThemedText>

			<Spacer />

			<ThemedView style={{
				marginHorizontal: 20
			}}>
				<ScrollView
					style={{
						maxHeight: 500,
					}}
					contentContainerStyle={{
						gap: 10,
						padding: 20,
						backgroundColor: colors.elevated
					}}
				>
					{
						folderList.map((folder) => {
							return (
								<ThemedButton style={{
									width: "100%",
									padding: 10,
									backgroundColor: colors.surface,
									borderRadius: 5
								}}
									title={
										<ThemedView style={{
											width: "100%",
											flexDirection: "row",
											backgroundColor: colors.surface,
											alignItems: "center",
											justifyContent: "space-around",
											gap: 10
										}}>
											<MaterialDesignIcons
												name="folder-music"
												size={20}
												color={colors.text}
											/>
											<ThemedText style={{ flex: 1, fontSize: 15 }}>{folder.name}</ThemedText>
										</ThemedView>
									}
									onPress={() => onFolderSelected(folder)} animated
									key={folder.id}
								/>
							)
						}
						)
					}
				</ScrollView>
			</ThemedView>

			<Spacer />

			{
				isSelectingMusicFolder &&
				<ThemedView style={{
					alignItems: "center",
					marginHorizontal: 20
				}}>
					<ThemedButton title={"Go Back"} width={"100%"} animated onPress={goBackToRootFolder} />
					<Spacer />
				</ThemedView>
			}

			<ThemedText style={{
				textAlign: "center"
			}} primary={false}>
				{
					isSelectingMusicFolder
						? "Select the folder where your music is stored."
						: "Select a root folder from your Google Drive."
				}
			</ThemedText>
		</ThemedView>
	)
};

const styles = StyleSheet.create({
	musicFolderHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 30
	}
})

export default index