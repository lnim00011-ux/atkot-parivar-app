import { useMemo, useState } from "react";
import { FlatList, Linking, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors, radius, spacing } from "../constants/theme";

function normalizePhone(whatsapp) {
  const clean = String(whatsapp || "").replace(/\D/g, "");
  return clean.startsWith("91") ? clean : `91${clean}`;
}

function MemberCard({ member }) {
  const phone = normalizePhone(member.whatsapp);
  return (
    <View style={styles.card}>
      <View style={styles.memberHeader}><View style={styles.avatar}><Text style={styles.avatarText}>{member.name?.charAt(0)?.toUpperCase() || "A"}</Text></View><View style={styles.memberText}><Text style={styles.name}>{member.name}</Text><Text style={styles.area}>{member.area}</Text></View></View>
      <Text style={styles.business}>{member.business || "Business details not added yet."}</Text>
      <Pressable onPress={() => Linking.openURL(`https://wa.me/${phone}`)} style={({ pressed }) => [styles.whatsappButton, pressed && styles.whatsappButtonPressed]}><Text style={styles.whatsappButtonText}>Chat on WhatsApp</Text></Pressable>
    </View>
  );
}

export default function MemberDirectory({ members }) {
  const [query, setQuery] = useState("");
  const filteredMembers = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return members;
    return members.filter((member) => [member.name, member.area, member.business].filter(Boolean).some((value) => value.toLowerCase().includes(search)));
  }, [members, query]);

  return <View style={styles.container}><View style={styles.header}><Text style={styles.title}>Atkot Parivar-Surat</Text><Text style={styles.subtitle}>Find members by name, area, or business.</Text></View><TextInput onChangeText={setQuery} placeholder="Search members" style={styles.search} value={query} /><FlatList contentContainerStyle={styles.listContent} data={filteredMembers} keyExtractor={(item) => item.id} keyboardShouldPersistTaps="handled" ListEmptyComponent={<Text style={styles.empty}>No members found.</Text>} renderItem={({ item }) => <MemberCard member={item} />} showsVerticalScrollIndicator={false} /></View>;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { marginBottom: spacing.md },
  title: { color: colors.text, fontSize: 28, fontWeight: "900", marginBottom: spacing.xs },
  subtitle: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  search: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md, borderWidth: 1, color: colors.text, fontSize: 16, marginBottom: spacing.md, minHeight: 50, paddingHorizontal: spacing.md },
  listContent: { gap: spacing.md, paddingBottom: spacing.xl },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1, padding: spacing.md },
  memberHeader: { alignItems: "center", flexDirection: "row", gap: spacing.md, marginBottom: spacing.md },
  avatar: { alignItems: "center", backgroundColor: colors.softGreen, borderRadius: 24, height: 48, justifyContent: "center", width: 48 },
  avatarText: { color: colors.primary, fontSize: 20, fontWeight: "900" },
  memberText: { flex: 1 },
  name: { color: colors.text, fontSize: 18, fontWeight: "900" },
  area: { color: colors.muted, fontSize: 14, fontWeight: "700", marginTop: 2 },
  business: { color: colors.text, fontSize: 15, lineHeight: 22, marginBottom: spacing.md },
  whatsappButton: { alignItems: "center", backgroundColor: colors.primary, borderRadius: radius.md, justifyContent: "center", minHeight: 46 },
  whatsappButtonPressed: { backgroundColor: colors.primaryDark },
  whatsappButtonText: { color: "#ffffff", fontSize: 15, fontWeight: "900" },
  empty: { color: colors.muted, fontSize: 16, marginTop: spacing.lg, textAlign: "center" }
});
