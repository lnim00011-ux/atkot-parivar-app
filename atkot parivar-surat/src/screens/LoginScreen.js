import { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors, radius, spacing } from "../constants/theme";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin() {
    const cleanWhatsapp = whatsapp.replace(/\D/g, "");
    if (cleanWhatsapp.length < 10 || password.length < 4) return setError("Enter a valid WhatsApp number and password.");
    setError(""); setIsSubmitting(true);
    try { await signIn({ whatsapp: cleanWhatsapp, password }); } catch (loginError) { setError(loginError.message); } finally { setIsSubmitting(false); }
  }

  return <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.screen}><View style={styles.card}><Text style={styles.kicker}>Community App</Text><Text style={styles.title}>Welcome to Atkot Parivar-Surat</Text><Text style={styles.subtitle}>Login with your member WhatsApp number to continue.</Text><Text style={styles.label}>WhatsApp number</Text><TextInput keyboardType="phone-pad" onChangeText={setWhatsapp} placeholder="98765 43210" style={styles.input} value={whatsapp} /><Text style={styles.label}>Password</Text><TextInput onChangeText={setPassword} placeholder="Enter password" secureTextEntry style={styles.input} value={password} />{error ? <Text style={styles.error}>{error}</Text> : null}<Pressable disabled={isSubmitting} onPress={handleLogin} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed, isSubmitting && styles.buttonDisabled]}>{isSubmitting ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.buttonText}>Login</Text>}</Pressable></View></KeyboardAvoidingView>;
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1, justifyContent: "center", padding: spacing.lg },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1, padding: spacing.lg },
  kicker: { color: colors.primary, fontSize: 13, fontWeight: "800", marginBottom: spacing.sm, textTransform: "uppercase" },
  title: { color: colors.text, fontSize: 30, fontWeight: "900", lineHeight: 36, marginBottom: spacing.sm },
  subtitle: { color: colors.muted, fontSize: 16, lineHeight: 23, marginBottom: spacing.lg },
  label: { color: colors.text, fontSize: 14, fontWeight: "800", marginBottom: spacing.xs },
  input: { backgroundColor: "#fbfaf7", borderColor: colors.border, borderRadius: radius.md, borderWidth: 1, color: colors.text, fontSize: 16, marginBottom: spacing.md, minHeight: 52, paddingHorizontal: spacing.md },
  error: { color: colors.danger, fontWeight: "700", marginBottom: spacing.md },
  button: { alignItems: "center", backgroundColor: colors.primary, borderRadius: radius.md, justifyContent: "center", minHeight: 52 },
  buttonPressed: { backgroundColor: colors.primaryDark },
  buttonDisabled: { opacity: 0.65 },
  buttonText: { color: "#ffffff", fontSize: 16, fontWeight: "900" }
});
