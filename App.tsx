import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DrawerNavigator from "./navigator/DrawerNavigator";

function AppContent() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={{ height: insets.top, backgroundColor: "#dc2626" }} />
      <DrawerNavigator />
    </View>
  );
}

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;