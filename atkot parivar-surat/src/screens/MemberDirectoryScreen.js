import { StyleSheet, View } from "react-native";
import MemberDirectory from "../components/MemberDirectory";
import { colors, spacing } from "../constants/theme";
import { useAuth } from "../context/AuthContext";
import { seedMembers } from "../data/seedMembers";

export default function MemberDirectoryScreen() {
  const { memberProfile } = useAuth();
  const members = memberProfile ? [memberProfile, ...seedMembers] : seedMembers;
  return <View style={styles.screen}><MemberDirectory members={members} /></View>;
}

const styles = StyleSheet.create({ screen: { backgroundColor: colors.background, flex: 1, padding: spacing.lg } });
