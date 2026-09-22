import { Stack } from "expo-router"

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