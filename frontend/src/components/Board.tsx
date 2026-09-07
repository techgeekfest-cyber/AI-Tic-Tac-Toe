import React from "react";
import { StyleSheet, View } from "react-native";
import Cell from "./Cell";
import { Board as BoardType } from "../game/rules";
import { colors, spacing } from "../theme";

type Props = {
  board: BoardType;
  onPress: (index: number) => void;
  disabled: boolean;
  winningLine: number[] | null;
  size: number;
};

const GAP = 8;

export default function Board({ board, onPress, disabled, winningLine, size }: Props) {
  const cellSize = (size - GAP * 2) / 3;
  return (
    <View testID="game-board" style={[styles.board, { width: size, height: size }]}>
      {board.map((v, i) => (
        <Cell
          key={i}
          index={i}
          value={v}
          onPress={onPress}
          disabled={disabled}
          highlighted={!!winningLine?.includes(i)}
          size={cellSize}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GAP,
    padding: 0,
    backgroundColor: colors.surface,
  },
});
