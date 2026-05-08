import { Picker } from "@react-native-picker/picker";
import { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SURAT_AREAS } from "../constants/areas";
import { colors, radius, spacing } from "../constants/theme";

const emptyProfile = { name: "", whatsapp: "", area: SURAT_AREAS[0], business: "" };

export default function RegistrationForm({ initialValues, onSubmit, submitLabel = "Save profile" }) {
  const startingValues = useMemo(() => ({ ...emptyProfile, ...initialValues }), [initialValues]);
  const [form, setForm] = useState(startingValues);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field, value) { setForm((current) => ({ ...current, [field]: value })); }

  async function handleSubmit() {
    const cleanWhatsapp = form.whatsapp.replace(/\D/g, "");
    if (!form.name.trim()) return setError("Name is required.");
    if (cleanWhatsapp.length < 10) return setError("Enter a valid WhatsApp number.");
    if (!form.area) return setError("Select your area in Surat.");
    setError("");
    setIsSubmitting(true);
    try {
      await onSubmit({ name: form.name.trim(), whatsapp: cleanWhatsapp, area: form.area, business: form.business.trim() });
    } catch (submitError) {
      setError(submitError.message || "Could not save profile.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Full name</Text>
      <TextInput autoCapitalize="words" onChangeText={(value) => updateField("name", value)} placeholder="Enter member name" style={styles.input} value={form.name} />
      <Text style={styles.label}>WhatsApp number</Text>
      <TextInput keyboardType="phone-pad" onChangeText={(value) => updateField("whatsapp", value)} placeholder="98765 43210" style={styles.input} value={form.whatsapp} />
      <Text style={styles.label}>Area in Surat</Text>
      <View style={styles.pickerWrap}><Picker onValueChange={(value) => updateField("area", value)} selectedValue={form.area} style={styles.picker}>{SURAT_AREAS.map((area) => <Picker.Item key={area} label={area} value={area} />)}</Picker></View>
      <Text style={styles.label}>Business details</Text>
      <TextInput multiline onChangeText={(value) => updateField("business", value)} placeholder="Business name, category, products, services..." style={[styles.input, styles.textArea]} textAlignVertical="top" value={form.business} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable disabled={isSubmitting} onPress={handleSubmit} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed, isSubmitting && styles.buttonDisabled]}>{isSubmitting ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.buttonText}>{submitLabel}</Text>}</Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg, borderWidth: 1, padding: spacing.lg },
  label: { color: colors.text, fontSize: 14, fontWeight: "800", marginBottom: spacing.xs },
  input: { backgroundColor: "#fbfaf7", borderColor: colors.border, borderRadius: radius.md, borderWidth: 1, color: colors.text, fontSize: 16, marginBottom: spacing.md, minHeight: 52, paddingHorizontal: spacing.md },
  pickerWrap: { backgroundColor: "#fbfaf7", borderColor: colors.border, borderRadius: radius.md, borderWidth: 1, marginBottom: spacing.md, overflow: "hidden" },
  picker: { color: colors.text },
  textArea: { minHeight: 120, paddingTop: spacing.md },
  error: { color: colors.danger, fontWeight: "700", marginBottom: spacing.md },
  button: { alignItems: "center", backgroundColor: colors.primary, borderRadius: radius.md, justifyContent: "center", minHeight: 52 },
  buttonPressed: { backgroundColor: colors.primaryDark },
  buttonDisabled: { opacity: 0.65 },
  buttonText: { color: "#ffffff", fontSize: 16, fontWeight: "900" }
});
