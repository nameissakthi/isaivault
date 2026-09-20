import { useEffect, useState } from "react";
import { Spacer, ThemedButton, ThemedText, ThemedView } from "../../components/components";
import { useLibrary, ASYNC_STORAGE_FOLDER_KEY_NAME } from "../../context/LibraryContext";
import { FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const Item = ({ title, onPress }) => {
  return (
    <ThemedButton style={{
      width: "100%",
      paddingHorizontal: 5,
      paddingVertical: 10,
      backgroundColor: "skyblue",
      borderRadius: 5
    }} title={title} onPress={onPress} animated />
  )
}

const index = () => {

  const [folderList, setFolderList] = useState([]);
  const { setMusicFolder, getGoogleDriveFolders } = useLibrary();
  const router = useRouter();

  const onFolderSelected = async (folder) => {
    try {
      await AsyncStorage.setItem(ASYNC_STORAGE_FOLDER_KEY_NAME, JSON.stringify(folder));
      setMusicFolder(folder);
      router.replace("/(tabs)");
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    const loadFolderList = async () => {
      const response = await getGoogleDriveFolders();
      setFolderList(response);
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
      }}>Music Folder Selection</ThemedText>

      <Spacer />

      <ThemedView style={{
        marginHorizontal: 50
      }}>
        <FlatList
          data={folderList}
          renderItem={({ item }) => <Item title={item.name} onPress={() => onFolderSelected(item)} />}
          keyExtractor={item => item.id}
          contentContainerStyle={{
            gap: 10
          }}
        />
      </ThemedView>

      <Spacer />

      <ThemedText style={{
        textAlign: "center"
      }} primary={false}>Please select a folder from your drive to set as root folder.</ThemedText>
    </ThemedView>
  )
};

export default index