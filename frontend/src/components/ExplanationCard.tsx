import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { colors, radius, spacing } from "../theme";

type Props = { text: string | null };

export default function ExplanationCard({ text }: Props) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(8);

  useEffect(() => {
    if (text) {
      opacity.value = 0;
      translateY.value = 8;
      opacity.value = withTiming(1, { duration: 250, easing: Easing.out(Easing.cubic) });
      translateY.value = withTiming(0, { duration: 250, easing: Easing.out(Easing.cubic) });
    } else {
      opacity.value = withTiming(0, { duration: 150 });
    }
  }, [text, opacity, translateY]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (!text) return <View style={styles.placeholder} testID="explanation-placeholder" />;

  return (
    <Animated.View testID="ai-explanation" style={[styles.card, style]}>
      <Text style={styles.label}>AI REASONING</Text>
      <Text style={styles.text}>{text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceTertiary,
    borderLeftWidth: 3,
    borderLeftColor: colors.brandPrimary,
    borderRadius: radius.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 68,
  },
  placeholder: {
    minHeight: 68,
  },
  label: {
    color: colors.brandPrimary,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  text: {
    color: colors.onSurface,
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
});
