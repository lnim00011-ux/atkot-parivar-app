import { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { colors, radius, spacing } from "../constants/theme";
import { useAuth } from "../context/AuthContext";
import { submitSupportTicket } from "../services/ticketService";

export default function SupportTicket() {
  const { memberProfile } = useAuth();
  const [message, setMessage] = useState("");
  const [statusText, setStatusText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (message.trim().length < 10) return setStatusText("Please describe the issue in at least 10 characters.");
    setIsSubmitting(true); setStatusText("");
    try { await submitSupportTicket({ message, member: memberProfile }); setMessage(""); setStatusText("Your ticket has been submitted."); }
    catch (error) { setStatusText(error.message); }
    finally { setIsSubmitting(false); }
  }

  return <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.screen}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled"><View style={styles.header}><Text style={styles.title}>Help</Text><Text style={styles.subtitle}>Raise a ticket or report a problem to the admin team.</Text></View><View style={styles.card}><Text style={styles.label}>Message</Text><TextInput multiline onChangeText={setMessage} placeholder="Write your message or problem here..." style={styles.textArea} textAlignVertical="top" value={message} />{statusText ? <Text style={styles.statusText}>{statusText}</Text> : null}<Pressable disabled={isSubmitting} onPress={handleSubmit} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed, isSubmitting && styles.buttonDisabled]}>{isSubmitting ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.buttonText}>Submit Ticket</Text>}</Pressable></View></ScrollView></KeyboardAvoidingView>;
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  header: { marginBottom: spacing.md },
  title: { color: colors.text, fontSize: 28, fontWeight: "900", marginBottom: spacing.xs },
  subtitle: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1, padding: spacing.lg },
  label: { color: colors.text, fontSize: 14, fontWeight: "800", marginBottom: spacing.xs },
  textArea: { backgroundColor: "#fbfaf7", borderColor: colors.border, borderRadius: radius.md, borderWidth: 1, color: colors.text, fontSize: 16, lineHeight: 22, marginBottom: spacing.md, minHeight: 180, padding: spacing.md },
  statusText: { color: colors.muted, fontWeight: "700", lineHeight: 20, marginBottom: spacing.md },
  button: { alignItems: "center", backgroundColor: colors.primary, borderRadius: radius.md, justifyContent: "center", minHeight: 52 },
  buttonPressed: { backgroundColor: colors.primaryDark },
  buttonDisabled: { opacity: 0.65 },
  buttonText: { color: "#ffffff", fontSize: 16, fontWeight: "900" }
});
