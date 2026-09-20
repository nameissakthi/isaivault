import { Tabs } from "expo-router"


const _layout = () => {
  return (
    <>
        <Tabs screenOptions={{
            headerShown : false
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title : "Home"
                }}
            />

            <Tabs.Screen
                name="playlist"
                options={{
                    title : "Playlist"
                }}
            />

            <Tabs.Screen
                name="settings"
                options={{
                    title : "Settings"
                }}
            />
        </Tabs>
    </>
  )
}

export default _layout