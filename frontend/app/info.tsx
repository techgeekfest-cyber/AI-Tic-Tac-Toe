import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing } from "../src/theme";

const HERO_URL =
  "https://images.unsplash.com/photo-1631375937044-6dd5beac01d2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTJ8MHwxfHNlYXJjaHwxfHxnbG93aW5nJTIwZ3JlZW4lMjBuZXVyYWwlMjBuZXR3b3JrfGVufDB8fHx8MTc4ODI4NTAwNnww&ixlib=rb-4.1.0&q=85";

type Section = { title: string; body: string };

const SECTIONS: Section[] = [
  {
    title: "01 · GAME STATE",
    body:
      "Every position in Tic-Tac-Toe can be represented as a 9-cell board. Given a state, we can compute all legal moves, and for each move imagine the new state that follows. This is the foundation the AI reasons over.",
  },
  {
    title: "02 · DECISION TREE",
    body:
      "Starting from the current board, we recursively expand every possible move for both players. This tree branches out until a terminal state — win, loss, or draw — is reached at each leaf.",
  },
  {
    title: "03 · MINIMAX",
    body:
      "The AI scores each terminal state: +10 for its own win, −10 for a loss, 0 for a draw. It then folds those scores back up the tree — assuming the AI maximises its score, and the human minimises it. The move at the root with the best worst-case outcome is chosen.",
  },
  {
    title: "04 · ALPHA-BETA PRUNING",
    body:
      "To stay fast, branches that can no longer influence the final decision are cut off. This gives the same optimal answer as pure Minimax but skips a large portion of the tree.",
  },
  {
    title: "05 · DEPTH BIAS",
    body:
      "Scores are adjusted by depth so the AI prefers faster wins and delays losses. This is why Hard difficulty presses winning threats immediately rather than wandering.",
  },
  {
    title: "06 · WHY HARD IS UNBEATABLE",
    body:
      "Tic-Tac-Toe's game tree is small enough that Minimax explores it completely. Against perfect play, the best a human can achieve is a draw — never a win. Try it.",
  },
  {
    title: "07 · DIFFICULTY TIERS",
    body:
      "Easy mostly plays random legal moves. Medium always takes immediate wins and blocks obvious threats, but sometimes plays randomly. Hard runs full Minimax on every move.",
  },
  {
    title: "08 · EXPLANATIONS",
    body:
      "After each AI move, the game inspects the resulting position: did it complete a line, block a threat, create a fork, or grab a strong opening square? The explanation text is derived from that inspection — not fabricated.",
  },
];

export default function InfoScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, spacing.lg) + spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Image source={{ uri: HERO_URL }} style={styles.heroImage} contentFit="cover" />
          <LinearGradient
            colors={["transparent", "rgba(10,10,10,0.6)", colors.surface]}
            locations={[0, 0.55, 1]}
            style={StyleSheet.absoluteFill}
          />
          <View style={[styles.heroInner, { paddingTop: insets.top + spacing.md }]}>
            <Pressable
              testID="back-btn"
              onPress={() => router.back()}
              hitSlop={12}
              style={styles.backBtn}
            >
              <Ionicons name="chevron-back" size={22} color={colors.onSurface} />
            </Pressable>
            <View style={styles.heroTextWrap}>
              <Text style={styles.heroKicker}>DOCUMENTATION</Text>
              <Text style={styles.heroTitle}>HOW THE AI WORKS</Text>
              <Text style={styles.heroSubtitle}>
                A student-friendly tour of the Minimax algorithm powering the Hard opponent.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sections}>
          {SECTIONS.map((s) => (
            <View key={s.title} testID={`info-section-${s.title.slice(0, 2)}`} style={styles.section}>
              <View style={styles.bullet} />
              <View style={styles.sectionBody}>
                <Text style={styles.sectionTitle}>{s.title}</Text>
                <Text style={styles.sectionText}>{s.body}</Text>
              </View>
            </View>
          ))}

          <View style={styles.footNote}>
            <Text style={styles.footNoteLabel}>ENGINEERING</Text>
            <Text style={styles.footNoteText}>
              Game rules, AI logic, and statistics are separated into independent modules:
              {"\n"}• src/game/rules.ts — pure board logic
              {"\n"}• src/game/ai.ts — Minimax + difficulty + explanations
              {"\n"}• src/game/storage.ts — AsyncStorage-backed statistics
              {"\n"}• src/components/* — UI components
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  hero: {
    height: 320,
    width: "100%",
    backgroundColor: colors.surfaceSecondary,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroInner: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: "space-between",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: "rgba(10,10,10,0.55)",
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTextWrap: {
    paddingBottom: spacing.xl,
  },
  heroKicker: {
    color: colors.brandPrimary,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 3,
    marginBottom: spacing.xs,
  },
  heroTitle: {
    color: colors.onSurface,
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: 2,
  },
  heroSubtitle: {
    color: colors.onSurfaceSecondary,
    fontSize: 14,
    marginTop: spacing.sm,
    lineHeight: 20,
    maxWidth: 320,
  },
  sections: {
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
    marginTop: spacing.lg,
  },
  section: {
    flexDirection: "row",
    gap: spacing.md,
  },
  bullet: {
    width: 3,
    borderRadius: 2,
    backgroundColor: colors.brandPrimary,
    marginTop: spacing.xs,
  },
  sectionBody: {
    flex: 1,
  },
  sectionTitle: {
    color: colors.onSurface,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  sectionText: {
    color: colors.onSurfaceSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
  footNote: {
    marginTop: spacing.md,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  footNoteLabel: {
    color: colors.brandPrimary,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: spacing.sm,
  },
  footNoteText: {
    color: colors.onSurfaceSecondary,
    fontSize: 13,
    lineHeight: 22,
  },
});
