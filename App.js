// Jacquys Barbosa da SIlva e Nicole de Oliveira Cafalloni
import react from "react";
import "react-native-gesture-handler";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from "@react-navigation/native";;
import StackNavigator from "./src/routes/route";
import * as Notifications from "expo-notifications"

const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}

