import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { GestureHandlerRootView } from "react-native-gesture-handler"
// import { useFonts } from "expo-font"
import { AppProvider } from "./src/context/AppContext"

// Screens
import HomeScreen from "./src/screens/HomeScreen"
import EmotionSelectionScreen from "./src/screens/EmotionSelectionScreen"
import PlantDetailScreen from "./src/screens/PlantDetailScreen"
import FriendGardensScreen from "./src/screens/FriendGardensScreen"
import SettingsScreen from "./src/screens/SettingsScreen"

const Stack = createNativeStackNavigator()

export default function App() {
  // const [fontsLoaded] = useFonts({
  //   "Inter-Regular": require("./assets/fonts/Inter-Regular.ttf"),
  //   "Inter-Bold": require("./assets/fonts/Inter-Bold.ttf"),
  // })

  // if (!fontsLoaded) {
  //   return null
  // }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: "#F9F5FF" },
              }}
            >
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="EmotionSelection" component={EmotionSelectionScreen} />
              <Stack.Screen name="PlantDetail" component={PlantDetailScreen} />
              <Stack.Screen name="FriendGardens" component={FriendGardensScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
