import { Stack } from "expo-router"
import { ThemedView, ThemedText } from "../../components/components";

const _layout = () => {
  return (
    <>
        <Stack screenOptions={{
            headerShown : false
        }}>
          <Stack.Screen name="login" options={{
            title : "Login"
          }} />
        </Stack>
        <ThemedView>
          <ThemedText style={{textAlign : "center", fontWeight : 900, fontSize : 10}}>Created with ❤️ by sakthivel</ThemedText>
        </ThemedView>
    </>
  )
}

export default _layout