import { Stack } from "expo-router"
import ThemedView from "../../components/ThemedView"
import ThemedText from "../../components/ThemedText"

const _layout = () => {
  return (
    <>
        <Stack screenOptions={{
            headerShown : false
        }}>
        </Stack>
        <ThemedView>
          <ThemedText style={{textAlign : "center", fontWeight : 900, fontSize : 10}}>Created with ❤️ by sakthivel</ThemedText>
        </ThemedView>
    </>
  )
}

export default _layout