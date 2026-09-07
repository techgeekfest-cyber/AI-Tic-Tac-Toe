import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "../theme";
import { Difficulty } from "../game/ai";

type Props = {
  value: Difficulty;
  onChange: (d: Difficulty) => void;
  disabled?: boolean;
};

const OPTIONS: { key: Difficulty; label: string }[] = [
  { key: "easy", label: "EASY" },
  { key: "medium", label: "MEDIUM" },
  { key: "hard", label: "HARD" },
];

export default function DifficultySelector({ value, onChange, disabled }: Props) {
  return (
    <View testID="difficulty-selector" style={styles.wrap}>
      {OPTIONS.map((opt) => {
        const selected = value === opt.key;
        return (
          <Pressable
            key={opt.key}
            testID={`difficulty-${opt.key}`}
            onPress={() => onChange(opt.key)}
            disabled={disabled}
            style={[styles.pill, selected && styles.pillSelected]}
          >
            <Text style={[styles.text, selected && styles.textSelected]}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.pill,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pill: {
    flex: 1,
    height: 40,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  pillSelected: {
    backgroundColor: colors.brandPrimary,
  },
  text: {
    color: colors.onSurfaceSecondary,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  textSelected: {
    color: colors.onBrandPrimary,
  },
});
