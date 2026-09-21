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
    </>
  )
}

export default _layout