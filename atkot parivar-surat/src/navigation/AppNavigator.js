import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { colors } from "../constants/theme";
import { useAuth } from "../context/AuthContext";
import AuthStack from "./AuthStack";
import MainStack from "./MainStack";

export default function AppNavigator() {
  const { isAuthenticated, isBootstrapping } = useAuth();
  if (isBootstrapping) {
    return <View style={styles.loader}><ActivityIndicator color={colors.primary} size="large" /></View>;
  }
  return <NavigationContainer>{isAuthenticated ? <MainStack /> : <AuthStack />}</NavigationContainer>;
}

const styles = StyleSheet.create({
  loader: { alignItems: "center", backgroundColor: colors.background, flex: 1, justifyContent: "center" }
});
