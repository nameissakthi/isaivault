import ThemedView from "./ThemedView"

const Spacer = ({ height = 30 }) => {
  return (
    <ThemedView style={{
        width : "100%",
        height : height
    }}></ThemedView>
  )
}

export default Spacer