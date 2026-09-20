import { Stack } from "expo-router"
import UserOnly from "../../components/auth/UserOnly";
import { ThemedView, ThemedText } from "../../components/components";

const _layout = () => {
  return (
    <>
        <Stack screenOptions={{
            headerShown : true
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