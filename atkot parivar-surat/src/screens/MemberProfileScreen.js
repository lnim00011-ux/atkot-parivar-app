import { ScrollView, StyleSheet, Text, View } from "react-native";
import RegistrationForm from "../components/RegistrationForm";
import { colors, spacing } from "../constants/theme";
import { useAuth } from "../context/AuthContext";

export default function MemberProfileScreen() {
  const { memberProfile, saveMemberProfile } = useAuth();
  return <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" style={styles.screen}><View style={styles.header}><Text style={styles.title}>Create your member profile</Text><Text style={styles.subtitle}>This profile is required before opening the community member directory.</Text></View><RegistrationForm initialValues={memberProfile} onSubmit={saveMemberProfile} /></ScrollView>;
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  header: { marginBottom: spacing.lg },
  title: { color: colors.text, fontSize: 28, fontWeight: "900", marginBottom: spacing.sm },
  subtitle: { color: colors.muted, fontSize: 16, lineHeight: 23 }
});
