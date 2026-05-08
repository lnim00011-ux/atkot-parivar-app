import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "../constants/theme";
import { useAuth } from "../context/AuthContext";
import { getNewsAlerts, registerForFcmPushNotifications } from "../services/notificationService";

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

export default function NotificationScreen() {
  const { memberProfile } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [statusText, setStatusText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const loadAlerts = useCallback(async () => { setAlerts(await getNewsAlerts()); }, []);

  useEffect(() => {
    async function bootstrap() {
      try { await Promise.all([loadAlerts(), registerForFcmPushNotifications(memberProfile?.id)]); setStatusText("Push alerts are active on this phone."); }
      catch (error) { setStatusText(error.message); }
      finally { setIsLoading(false); }
    }
    bootstrap();
  }, [loadAlerts, memberProfile?.id]);

  async function handleRefresh() { setIsRefreshing(true); try { await loadAlerts(); } finally { setIsRefreshing(false); } }

  if (isLoading) return <View style={[styles.screen, styles.center]}><ActivityIndicator color={colors.primary} size="large" /><Text style={styles.loadingText}>Loading alerts...</Text></View>;

  return <View style={styles.screen}><View style={styles.header}><Text style={styles.title}>News & Alerts</Text><Text style={styles.subtitle}>Admin announcements for all Atkot Parivar-Surat members.</Text></View><View style={styles.statusCard}><Text style={styles.statusTitle}>Notification Department</Text><Text style={styles.statusText}>{statusText}</Text></View><FlatList data={alerts} keyExtractor={(item) => item.id} refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={colors.primary} />} contentContainerStyle={styles.listContent} ListEmptyComponent={<Text style={styles.empty}>No alerts yet.</Text>} renderItem={({ item }) => <View style={styles.alertCard}><Text style={styles.alertTitle}>{item.title}</Text><Text style={styles.alertMessage}>{item.message}</Text><Text style={styles.alertDate}>{formatDate(item.created_at)}</Text></View>} /><Pressable onPress={handleRefresh} style={styles.refreshButton}><Text style={styles.refreshText}>Refresh Alerts</Text></Pressable></View>;
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1, padding: spacing.lg },
  center: { alignItems: "center", justifyContent: "center" },
  loadingText: { color: colors.muted, marginTop: spacing.md },
  header: { marginBottom: spacing.md },
  title: { color: colors.text, fontSize: 28, fontWeight: "900", marginBottom: spacing.xs },
  subtitle: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  statusCard: { backgroundColor: colors.softGreen, borderRadius: radius.md, marginBottom: spacing.md, padding: spacing.md },
  statusTitle: { color: colors.primaryDark, fontSize: 14, fontWeight: "900", marginBottom: 4 },
  statusText: { color: colors.text, lineHeight: 20 },
  listContent: { gap: spacing.md, paddingBottom: 88 },
  alertCard: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1, padding: spacing.md },
  alertTitle: { color: colors.text, fontSize: 18, fontWeight: "900", marginBottom: spacing.xs },
  alertMessage: { color: colors.text, fontSize: 15, lineHeight: 22, marginBottom: spacing.md },
  alertDate: { color: colors.muted, fontSize: 13, fontWeight: "700" },
  empty: { color: colors.muted, marginTop: spacing.xl, textAlign: "center" },
  refreshButton: { alignItems: "center", backgroundColor: colors.primary, borderRadius: radius.md, bottom: spacing.lg, left: spacing.lg, minHeight: 50, justifyContent: "center", position: "absolute", right: spacing.lg },
  refreshText: { color: "#ffffff", fontSize: 15, fontWeight: "900" }
});
