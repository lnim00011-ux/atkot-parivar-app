import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { colors, radius, spacing } from "../constants/theme";
import { useAuth } from "../context/AuthContext";
import { uploadStudentResult } from "../services/resultService";

export default function UploadResult() {
  const { memberProfile } = useAuth();
  const [studentName, setStudentName] = useState("");
  const [standard, setStandard] = useState("");
  const [imageUri, setImageUri] = useState("");
  const [statusText, setStatusText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function pickFromGallery() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return Alert.alert("Permission required", "Please allow gallery access to upload a result.");
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, quality: 0.85 });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  }

  async function captureWithCamera() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return Alert.alert("Permission required", "Please allow camera access to capture a result.");
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ["images"], allowsEditing: true, quality: 0.85 });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  }

  async function handleUpload() {
    if (!studentName.trim() || !standard.trim()) return setStatusText("Student name and standard/class are required.");
    if (!imageUri) return setStatusText("Please add a result photo.");
    setStatusText(""); setIsSubmitting(true);
    try {
      await uploadStudentResult({ imageUri, studentName, standard, memberId: memberProfile?.id });
      setStudentName(""); setStandard(""); setImageUri(""); setStatusText("Result uploaded for admin review.");
    } catch (error) { setStatusText(error.message); } finally { setIsSubmitting(false); }
  }

  return <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.screen}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled"><View style={styles.header}><Text style={styles.title}>Parivar Achievements</Text><Text style={styles.subtitle}>Upload student result photos for community recognition.</Text></View><View style={styles.card}><Text style={styles.label}>Student Name</Text><TextInput autoCapitalize="words" onChangeText={setStudentName} placeholder="Enter student name" style={styles.input} value={studentName} /><Text style={styles.label}>Standard/Class</Text><TextInput onChangeText={setStandard} placeholder="Example: Standard 10" style={styles.input} value={standard} /><View style={styles.uploadActions}><Pressable onPress={pickFromGallery} style={styles.secondaryButton}><Text style={styles.secondaryButtonText}>Upload Result</Text></Pressable><Pressable onPress={captureWithCamera} style={styles.secondaryButton}><Text style={styles.secondaryButtonText}>Open Camera</Text></Pressable></View>{imageUri ? <Image source={{ uri: imageUri }} style={styles.preview} /> : null}{statusText ? <Text style={styles.statusText}>{statusText}</Text> : null}<Pressable disabled={isSubmitting} onPress={handleUpload} style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed, isSubmitting && styles.buttonDisabled]}>{isSubmitting ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.primaryButtonText}>Submit Achievement</Text>}</Pressable></View></ScrollView></KeyboardAvoidingView>;
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  header: { marginBottom: spacing.md },
  title: { color: colors.text, fontSize: 28, fontWeight: "900", marginBottom: spacing.xs },
  subtitle: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1, padding: spacing.lg },
  label: { color: colors.text, fontSize: 14, fontWeight: "800", marginBottom: spacing.xs },
  input: { backgroundColor: "#fbfaf7", borderColor: colors.border, borderRadius: radius.md, borderWidth: 1, color: colors.text, fontSize: 16, marginBottom: spacing.md, minHeight: 52, paddingHorizontal: spacing.md },
  uploadActions: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.md },
  secondaryButton: { alignItems: "center", backgroundColor: colors.softGold, borderRadius: radius.md, flex: 1, justifyContent: "center", minHeight: 48, paddingHorizontal: spacing.sm },
  secondaryButtonText: { color: colors.text, fontSize: 14, fontWeight: "900", textAlign: "center" },
  preview: { backgroundColor: colors.softGreen, borderRadius: radius.md, height: 220, marginBottom: spacing.md, width: "100%" },
  statusText: { color: colors.muted, fontWeight: "700", lineHeight: 20, marginBottom: spacing.md },
  primaryButton: { alignItems: "center", backgroundColor: colors.primary, borderRadius: radius.md, justifyContent: "center", minHeight: 52 },
  primaryButtonPressed: { backgroundColor: colors.primaryDark },
  buttonDisabled: { opacity: 0.65 },
  primaryButtonText: { color: "#ffffff", fontSize: 16, fontWeight: "900" }
});
