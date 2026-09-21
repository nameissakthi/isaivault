import { useEffect } from "react";
import { ThemedText, ThemedView } from "../../components/components";
import { getDriveFiles } from "../../services/drive/driveService";

const index = () => {

  useEffect(() => {
    const loadDriveFiles = async () => {
      try {
        // const files = await getDriveFiles();

      } catch (error) {
        console.log(error.message);
      }
    }

    loadDriveFiles();
  }, [])

  return (
    <ThemedView safe style={{
      flex : 1
    }}>
        <ThemedText>Home</ThemedText>
    </ThemedView>
  )
}

export default index