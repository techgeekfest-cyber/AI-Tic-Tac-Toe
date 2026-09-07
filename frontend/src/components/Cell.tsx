import React, { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from "react-native-reanimated";
import { colors, radius } from "../theme";
import { Cell as CellValue } from "../game/rules";

type Props = {
  index: number;
  value: CellValue;
  onPress: (index: number) => void;
  disabled: boolean;
  highlighted: boolean;
  size: number;
};

export default function Cell({
  index,
  value,
  onPress,
  disabled,
  highlighted,
  size,
}: Props) {
  const scale = useSharedValue(0);
  const glow = useSharedValue(0);

  useEffect(() => {
    if (value) {
      scale.value = 0;
      scale.value = withSpring(1, { damping: 12, stiffness: 180 });
    } else {
      scale.value = 0;
    }
  }, [value, scale]);

  useEffect(() => {
    glow.value = withTiming(highlighted ? 1 : 0, {
      duration: 350,
      easing: Easing.out(Easing.cubic),
    });
  }, [highlighted, glow]);

  const markStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: scale.value,
  }));

  const cellStyle = useAnimatedStyle(() => ({
    borderColor: glow.value > 0 ? colors.brandPrimary : colors.border,
    borderWidth: 1 + glow.value * 1.5,
    shadowOpacity: glow.value * 0.8,
  }));

  const color = value === "X" ? colors.brandPrimary : colors.brandSecondary;

  return (
    <Pressable
      testID={`board-cell-${index}`}
      onPress={() => onPress(index)}
      disabled={disabled || value !== null}
      style={{ width: size, height: size }}
    >
      <Animated.View style={[styles.cell, { width: size, height: size }, cellStyle]}>
        {value && (
          <Animated.Text
            style={[
              styles.mark,
              { color, fontSize: size * 0.55 },
              markStyle,
            ]}
          >
            {value}
          </Animated.Text>
        )}
        {highlighted && <View pointerEvents="none" style={styles.winOverlay} />}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.brandPrimary,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  mark: {
    fontWeight: "900",
    letterSpacing: 2,
    includeFontPadding: false,
  },
  winOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.md,
    backgroundColor: "#ccff0022",
  },
});
