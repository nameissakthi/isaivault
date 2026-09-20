import { Spacer, ThemedButton, ThemedText, ThemedView } from "../../components/components";
import { useAuth } from "../../context/AuthContext";
import { Image, useColorScheme } from "react-native";
import Colors from "../../constants/Colors";

const settings = () => {

	const { user, logout, isLoading } = useAuth();

	const theme = useColorScheme();
	const colors = theme === 'dark' ? Colors.dark : Colors.light;

	return (
		<ThemedView safe style={{
			flex: 1
		}}>
			<Spacer />

			<ThemedView style={{
				alignItems : "center"
			}}>
				<Image
					source={{
						uri: user?.photo
					}}

					style={{
						width: 100,
						height: 100,
						borderRadius: 100
					}}

					alt="User"
				/>
				<ThemedText style={{
					fontWeight : 800,
					fontSize : 30
				}}>{user?.name}</ThemedText>
			</ThemedView>

			<Spacer />

			<ThemedView style={{
				paddingHorizontal : 20
			}}>
				<ThemedView style={{
					backgroundColor : colors.elevated,
					padding : 10,
					borderRadius : 5
				}}>
					<ThemedText style={{
						fontWeight : 800,
						fontSize : 15
					}}>Email</ThemedText>
					<ThemedText style={{
						fontWeight : 800,
						marginLeft : 10,
						marginTop : 10
					}}>{user?.email}</ThemedText>
				</ThemedView>
			</ThemedView>

			<Spacer />

			<ThemedView style={{
				marginHorizontal : 20,
				flexDirection : "row",
				justifyContent : "space-between",
				alignItems : "center",
				backgroundColor : "skyblue",
				borderRadius : 100
			}}>
				<Image
					source={{
						uri : "https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-google-icon-logo-png-transparent-svg-vector-bie-supply-14.png"
					}}

					style={{
						width : 40,
						height : 40
					}}

					alt="Google Logo"
				/>

				<ThemedText style={{
					fontSize : 20,
					marginRight : 10,
					color : colors.textSecondary
				}}>Connected With Google Drive</ThemedText>
			</ThemedView>

			<Spacer />

			<ThemedView style={{
				paddingHorizontal : 20
			}}>
				{
					isLoading ?
						<ThemedButton style={{ backgroundColor: "red" }} width={"100%"} title={"Logging Out...."} disabled /> :
						<ThemedButton style={{ backgroundColor: "red" }} width={"100%"} title={"Logout"} onPress={logout} />
				}
			</ThemedView>
		</ThemedView>
	)
}

export default settings