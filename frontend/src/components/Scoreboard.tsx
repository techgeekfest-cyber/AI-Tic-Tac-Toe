import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "../theme";
import { Stats } from "../game/storage";

type Props = { stats: Stats };

export default function Scoreboard({ stats }: Props) {
  const streakLabel =
    stats.streak === 0
      ? "—"
      : stats.streak > 0
        ? `+${stats.streak} You`
        : `${Math.abs(stats.streak)} AI`;
  const streakColor =
    stats.streak > 0
      ? colors.brandPrimary
      : stats.streak < 0
        ? colors.brandSecondary
        : colors.onSurfaceTertiary;

  return (
    <View testID="scoreboard" style={styles.wrap}>
      <Stat label="YOU" value={stats.playerWins} testID="stat-player" color={colors.brandPrimary} />
      <Divider />
      <Stat label="DRAW" value={stats.draws} testID="stat-draws" color={colors.onSurfaceSecondary} />
      <Divider />
      <Stat label="AI" value={stats.aiWins} testID="stat-ai" color={colors.brandSecondary} />
      <Divider />
      <View style={styles.col}>
        <Text style={styles.label}>STREAK</Text>
        <Text testID="stat-streak" style={[styles.value, { color: streakColor, fontSize: 20 }]}>
          {streakLabel}
        </Text>
      </View>
    </View>
  );
}

function Stat({
  label,
  value,
  testID,
  color,
}: {
  label: string;
  value: number;
  testID: string;
  color: string;
}) {
  return (
    <View style={styles.col}>
      <Text style={styles.label}>{label}</Text>
      <Text testID={testID} style={[styles.value, { color }]}>
        {value}
      </Text>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  col: {
    alignItems: "center",
    flex: 1,
  },
  label: {
    color: colors.onSurfaceTertiary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 1,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: colors.divider,
  },
});
