import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "../theme";
import { Player } from "../game/rules";

type Props = {
  value: Player;
  onChange: (p: Player) => void;
  disabled?: boolean;
};

export default function SymbolSelector({ value, onChange, disabled }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>YOU PLAY</Text>
      <View style={styles.row}>
        {(["X", "O"] as Player[]).map((p) => {
          const selected = value === p;
          const color = p === "X" ? colors.brandPrimary : colors.brandSecondary;
          return (
            <Pressable
              key={p}
              testID={`symbol-${p}`}
              onPress={() => onChange(p)}
              disabled={disabled}
              style={[
                styles.chip,
                selected && { borderColor: color, backgroundColor: color + "22" },
              ]}
            >
              <Text style={[styles.symbol, { color }]}>{p}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  label: {
    color: colors.onSurfaceTertiary,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  chip: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  symbol: {
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 1,
  },
});
