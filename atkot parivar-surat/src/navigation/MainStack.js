import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Pressable, Text } from "react-native";
import { colors } from "../constants/theme";
import { useAuth } from "../context/AuthContext";
import MemberDirectoryScreen from "../screens/MemberDirectoryScreen";
import MemberProfileScreen from "../screens/MemberProfileScreen";
import NotificationScreen from "../screens/NotificationScreen";
import SupportTicket from "../screens/SupportTicket";
import UploadResult from "../screens/UploadResult";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function DepartmentTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.muted, tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border, minHeight: 62, paddingBottom: 8, paddingTop: 8 }, tabBarLabelStyle: { fontSize: 12, fontWeight: "800" } }}>
      <Tab.Screen name="Directory" component={MemberDirectoryScreen} />
      <Tab.Screen name="Alerts" component={NotificationScreen} options={{ title: "News" }} />
      <Tab.Screen name="Achievements" component={UploadResult} />
      <Tab.Screen name="Help" component={SupportTicket} />
    </Tab.Navigator>
  );
}

export default function MainStack() {
  const { hasCompletedProfile, signOut } = useAuth();
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.background }, headerShadowVisible: false, headerTintColor: colors.text, headerTitleStyle: { fontWeight: "800" }, headerRight: () => (<Pressable onPress={signOut} hitSlop={12}><Text style={{ color: colors.primary, fontWeight: "800" }}>Logout</Text></Pressable>) }}>
      {!hasCompletedProfile ? (
        <Stack.Screen name="MemberProfile" component={MemberProfileScreen} options={{ title: "Complete Profile" }} />
      ) : (
        <Stack.Screen name="Departments" component={DepartmentTabs} options={{ title: "Atkot Parivar-Surat" }} />
      )}
    </Stack.Navigator>
  );
}
