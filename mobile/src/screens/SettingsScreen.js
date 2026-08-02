import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from "react-native";

// Note: this screen is UI-only for the hackathon scaffold — wiring it to
// PATCH /api/patients/:id (or similar) is a natural next step, not yet
// implemented in the backend.
export default function SettingsScreen() {
  const [caregiverEmail, setCaregiverEmail] = useState("caregiver@example.com");
  const [caregiverName, setCaregiverName] = useState("Demo Caregiver");

  function handleSave() {
    Alert.alert(
      "Saved locally",
      "Wire this up to a PATCH /api/patients/:id endpoint to persist it."
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Caregiver details</Text>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={caregiverName}
        onChangeText={setCaregiverName}
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={caregiverEmail}
        onChangeText={setCaregiverEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F1EC", padding: 20 },
  title: { fontSize: 22, fontWeight: "700", color: "#2E2A24", marginBottom: 20 },
  label: { fontSize: 13, color: "#8A8377", marginBottom: 6, marginTop: 14 },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#E3DED3",
  },
  saveButton: {
    backgroundColor: "#4C7A5C",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 28,
  },
  saveButtonText: { color: "#FFFFFF", fontWeight: "600", fontSize: 15 },
});
