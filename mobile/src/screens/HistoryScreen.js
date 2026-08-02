import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getLogs, generateDigest } from "../api/client";

export default function HistoryScreen() {
  const [logs, setLogs] = useState([]);
  const [adherenceRate, setAdherenceRate] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [digest, setDigest] = useState(null);
  const [generating, setGenerating] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await getLogs(7);
      setLogs(data.logs);
      setAdherenceRate(data.adherenceRate);
    } catch (err) {
      console.warn("Failed to load logs:", err.message);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function handleGenerateDigest() {
    setGenerating(true);
    try {
      const result = await generateDigest();
      setDigest(result.digest);
    } catch (err) {
      console.warn("Digest generation failed:", err.message);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>This week</Text>

      <View style={styles.adherenceCard}>
        <Text style={styles.adherenceValue}>
          {adherenceRate === null ? "—" : `${adherenceRate}%`}
        </Text>
        <Text style={styles.adherenceLabel}>adherence rate</Text>
      </View>

      <FlatList
        data={logs}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={load} />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No logs yet — go log today's meds!</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.logRow}>
            <Text
              style={[
                styles.logStatus,
                item.status === "taken" ? styles.taken : styles.skipped,
              ]}
            >
              {item.status === "taken" ? "✓ Took it" : "Skipped"}
            </Text>
            <Text style={styles.logDate}>{item.logged_at}</Text>
            {item.note ? <Text style={styles.logNote}>{item.note}</Text> : null}
          </View>
        )}
      />

      <Pressable
        style={styles.digestButton}
        onPress={handleGenerateDigest}
        disabled={generating}
      >
        {generating ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.digestButtonText}>
            Generate caregiver digest
          </Text>
        )}
      </Pressable>

      {digest && (
        <View style={styles.digestCard}>
          <Text style={styles.digestLabel}>Digest preview</Text>
          <Text style={styles.digestText}>{digest}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F1EC", padding: 20 },
  title: { fontSize: 22, fontWeight: "700", color: "#2E2A24", marginBottom: 12 },
  adherenceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E3DED3",
  },
  adherenceValue: { fontSize: 36, fontWeight: "800", color: "#4C7A5C" },
  adherenceLabel: { fontSize: 13, color: "#8A8377", marginTop: 2 },
  empty: { textAlign: "center", color: "#8A8377", marginTop: 40 },
  logRow: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E3DED3",
  },
  logStatus: { fontSize: 15, fontWeight: "600" },
  taken: { color: "#4C7A5C" },
  skipped: { color: "#B7644B" },
  logDate: { fontSize: 12, color: "#8A8377", marginTop: 2 },
  logNote: { fontSize: 13, color: "#5A5548", marginTop: 6, fontStyle: "italic" },
  digestButton: {
    backgroundColor: "#2E2A24",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 12,
  },
  digestButtonText: { color: "#FFFFFF", fontWeight: "600", fontSize: 15 },
  digestCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E3DED3",
  },
  digestLabel: { fontSize: 12, color: "#8A8377", marginBottom: 6, textTransform: "uppercase" },
  digestText: { fontSize: 14, color: "#2E2A24", lineHeight: 20 },
});
