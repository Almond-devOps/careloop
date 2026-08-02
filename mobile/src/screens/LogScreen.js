import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { postLog } from "../api/client";

export default function LogScreen({ navigation }) {
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [lastStatus, setLastStatus] = useState(null);

  async function handleLog(status) {
    setSubmitting(true);
    try {
      await postLog({ status, note: note.trim() || undefined });
      setLastStatus(status);
      setNote("");
    } catch (err) {
      Alert.alert("Couldn't save that", err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.greeting}>How are today's meds?</Text>
      <Text style={styles.subtitle}>One tap. That's it.</Text>

      <View style={styles.buttonRow}>
        <Pressable
          style={[styles.bigButton, styles.takenButton]}
          onPress={() => handleLog("taken")}
          disabled={submitting}
        >
          <Text style={styles.bigButtonText}>✓ Took it</Text>
        </Pressable>

        <Pressable
          style={[styles.bigButton, styles.skippedButton]}
          onPress={() => handleLog("skipped")}
          disabled={submitting}
        >
          <Text style={styles.bigButtonText}>Skipped</Text>
        </Pressable>
      </View>

      <TextInput
        style={styles.noteInput}
        placeholder="Optional: how are you feeling? (e.g. tired, fine, headache)"
        value={note}
        onChangeText={setNote}
        multiline
      />

      {lastStatus && (
        <Text style={styles.confirmation}>
          Logged: {lastStatus === "taken" ? "Took it ✓" : "Skipped"} — thanks!
        </Text>
      )}

      <Pressable
        style={styles.historyLink}
        onPress={() => navigation.navigate("History")}
      >
        <Text style={styles.historyLinkText}>View my history →</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F1EC",
    padding: 24,
    justifyContent: "center",
  },
  greeting: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2E2A24",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#8A8377",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 32,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  bigButton: {
    flex: 1,
    paddingVertical: 28,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  takenButton: {
    backgroundColor: "#4C7A5C",
  },
  skippedButton: {
    backgroundColor: "#B7644B",
  },
  bigButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  noteInput: {
    marginTop: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    minHeight: 70,
    fontSize: 15,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#E3DED3",
  },
  confirmation: {
    marginTop: 18,
    textAlign: "center",
    color: "#4C7A5C",
    fontWeight: "500",
  },
  historyLink: {
    marginTop: 36,
    alignItems: "center",
  },
  historyLinkText: {
    color: "#8A8377",
    fontSize: 14,
  },
});
