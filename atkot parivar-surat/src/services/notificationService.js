import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { isSupabaseConfigured, supabase } from "../config/supabase";
import { seedAlerts } from "../data/seedAlerts";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true
  })
});

export async function registerForFcmPushNotifications(memberId) {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("news-alerts", {
      name: "News & Alerts",
      importance: Notifications.AndroidImportance.MAX
    });
  }

  const existingPermission = await Notifications.getPermissionsAsync();
  let finalStatus = existingPermission.status;

  if (existingPermission.status !== "granted") {
    const requestedPermission = await Notifications.requestPermissionsAsync();
    finalStatus = requestedPermission.status;
  }

  if (finalStatus !== "granted") throw new Error("Notification permission was not granted.");

  const nativeToken = await Notifications.getDevicePushTokenAsync();

  if (isSupabaseConfigured) {
    const { error } = await supabase.from("push_tokens").upsert(
      {
        member_id: memberId,
        token: nativeToken.data,
        token_type: nativeToken.type,
        platform: Platform.OS,
        updated_at: new Date().toISOString()
      },
      { onConflict: "token" }
    );
    if (error) throw error;
  }

  return nativeToken;
}

export async function getNewsAlerts() {
  if (!isSupabaseConfigured) return seedAlerts;

  const { data, error } = await supabase
    .from("news_alerts")
    .select("id,title,message,created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
