
import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";
import DrawerNavigator from "./navigator/DrawerNavigator";

function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <DrawerNavigator />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default App;