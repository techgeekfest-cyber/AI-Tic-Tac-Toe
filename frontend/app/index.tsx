import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { colors, radius, spacing } from "../src/theme";
import {
  Board as BoardType,
  EMPTY_BOARD,
  Player,
  applyMove,
  evaluate,
  opponent,
} from "../src/game/rules";
import { Difficulty, pickAIMove } from "../src/game/ai";
import {
  DEFAULT_STATS,
  Stats,
  loadStats,
  resetStats,
  saveStats,
  updateStatsFor,
} from "../src/game/storage";
import { play as playSfx } from "../src/game/sounds";

import Board from "../src/components/Board";
import Scoreboard from "../src/components/Scoreboard";
import DifficultySelector from "../src/components/DifficultySelector";
import SymbolSelector from "../src/components/SymbolSelector";
import ExplanationCard from "../src/components/ExplanationCard";

type Status = "playing" | "playerWon" | "aiWon" | "draw";

export default function GameScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [playerSymbol, setPlayerSymbol] = useState<Player>("X");
  const [difficulty, setDifficulty] = useState<Difficulty>("hard");
  const [board, setBoard] = useState<BoardType>(EMPTY_BOARD);
  const [turn, setTurn] = useState<Player>("X");
  const [status, setStatus] = useState<Status>("playing");
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>(DEFAULT_STATS);

  const aiPendingRef = useRef(false);
  const resultRecordedRef = useRef(false);

  const aiSymbol: Player = opponent(playerSymbol);

  // Load persisted stats once.
  useEffect(() => {
    loadStats().then(setStats).catch(() => {});
  }, []);

  // Handle game result side-effects (stats + haptics + sfx) — record only once.
  useEffect(() => {
    if (status === "playing") {
      resultRecordedRef.current = false;
      return;
    }
    if (resultRecordedRef.current) return;
    resultRecordedRef.current = true;

    let outcome: "player" | "ai" | "draw" = "draw";
    if (status === "playerWon") outcome = "player";
    else if (status === "aiWon") outcome = "ai";

    if (outcome === "player") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      playSfx("win");
    } else if (outcome === "ai") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      playSfx("lose");
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
      playSfx("draw");
    }

    setStats((prev) => {
      const next = updateStatsFor(prev, outcome);
      saveStats(next).catch(() => {});
      return next;
    });
  }, [status]);

  const startNewGame = useCallback(
    (nextSymbol?: Player, nextDifficulty?: Difficulty) => {
      aiPendingRef.current = false;
      resultRecordedRef.current = false;
      const symbol = nextSymbol ?? playerSymbol;
      setBoard(EMPTY_BOARD);
      setTurn("X"); // X always moves first
      setStatus("playing");
      setWinningLine(null);
      setExplanation(null);
      if (nextSymbol) setPlayerSymbol(nextSymbol);
      if (nextDifficulty) setDifficulty(nextDifficulty);

      // If player chose O, AI (X) needs to move first — trigger via effect.
      if (symbol === "O") {
        // handled by AI turn effect since turn === "X" and aiSymbol === "X"
      }
    },
    [playerSymbol],
  );

  const handleCellPress = useCallback(
    (index: number) => {
      if (status !== "playing") return;
      if (turn !== playerSymbol) return;
      if (board[index] !== null) return;
      if (aiPendingRef.current) return;

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      playSfx("tap");

      const next = applyMove(board, index, playerSymbol);
      setBoard(next);
      setExplanation(null);

      const res = evaluate(next);
      if (res.winner === playerSymbol) {
        setWinningLine(res.line);
        setStatus("playerWon");
        return;
      }
      if (res.winner === "DRAW") {
        setStatus("draw");
        return;
      }
      setTurn(aiSymbol);
    },
    [board, status, turn, playerSymbol, aiSymbol],
  );

  // AI turn effect
  useEffect(() => {
    if (status !== "playing") return;
    if (turn !== aiSymbol) return;
    if (aiPendingRef.current) return;

    aiPendingRef.current = true;
    const timeoutId = setTimeout(() => {
      // Recompute against latest board via functional setState
      setBoard((current) => {
        const move = pickAIMove(current, aiSymbol, difficulty);
        if (move.index < 0) {
          aiPendingRef.current = false;
          return current;
        }
        const next = applyMove(current, move.index, aiSymbol);
        setExplanation(move.explanation);
        Haptics.selectionAsync().catch(() => {});
        playSfx("aiMove");

        const res = evaluate(next);
        if (res.winner === aiSymbol) {
          setWinningLine(res.line);
          setStatus("aiWon");
        } else if (res.winner === "DRAW") {
          setStatus("draw");
        } else {
          setTurn(playerSymbol);
        }
        aiPendingRef.current = false;
        return next;
      });
    }, 550);

    return () => clearTimeout(timeoutId);
  }, [turn, status, aiSymbol, difficulty, playerSymbol]);

  const onDifficultyChange = useCallback(
    (d: Difficulty) => {
      Haptics.selectionAsync().catch(() => {});
      startNewGame(undefined, d);
    },
    [startNewGame],
  );

  const onSymbolChange = useCallback(
    (p: Player) => {
      Haptics.selectionAsync().catch(() => {});
      startNewGame(p);
    },
    [startNewGame],
  );

  const onNewGame = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    startNewGame();
  }, [startNewGame]);

  const onResetStats = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    const fresh = await resetStats();
    setStats(fresh);
    startNewGame();
  }, [startNewGame]);

  const boardSize = useMemo(() => {
    const w = Dimensions.get("window").width;
    return Math.min(w - spacing.lg * 2, 380);
  }, []);

  const turnLabel = useMemo(() => {
    if (status === "playerWon") return "YOU WIN";
    if (status === "aiWon") return "AI WINS";
    if (status === "draw") return "DRAW";
    return turn === playerSymbol ? "YOUR TURN" : "AI THINKING…";
  }, [status, turn, playerSymbol]);

  const turnColor =
    status === "playerWon"
      ? colors.brandPrimary
      : status === "aiWon"
        ? colors.brandSecondary
        : status === "draw"
          ? colors.onSurfaceSecondary
          : turn === playerSymbol
            ? colors.brandPrimary
            : colors.brandSecondary;

  const boardDisabled = status !== "playing" || turn !== playerSymbol;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, spacing.lg) + spacing.lg },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>
              TIC<Text style={{ color: colors.brandPrimary }}>TAC</Text>AI
            </Text>
            <Text style={styles.tagline}>MINIMAX OPPONENT</Text>
          </View>
          <Pressable
            testID="open-info"
            onPress={() => router.push("/info")}
            hitSlop={12}
            style={styles.infoBtn}
          >
            <Ionicons name="information-circle-outline" size={24} color={colors.brandPrimary} />
          </Pressable>
        </View>

        <Scoreboard stats={stats} />

        <View style={styles.controlsRow}>
          <SymbolSelector value={playerSymbol} onChange={onSymbolChange} />
        </View>

        <DifficultySelector value={difficulty} onChange={onDifficultyChange} />

        <View
          testID="turn-indicator"
          style={[
            styles.turnPill,
            { borderColor: turnColor, shadowColor: turnColor },
          ]}
        >
          <View style={[styles.turnDot, { backgroundColor: turnColor }]} />
          <Text style={[styles.turnText, { color: turnColor }]}>{turnLabel}</Text>
        </View>

        <View style={styles.boardWrap}>
          <Board
            board={board}
            onPress={handleCellPress}
            disabled={boardDisabled}
            winningLine={winningLine}
            size={boardSize}
          />
        </View>

        <ExplanationCard text={explanation} />

        <View style={styles.actionsRow}>
          <Pressable testID="new-game-btn" onPress={onNewGame} style={styles.primaryBtn}>
            <Ionicons name="refresh" size={18} color={colors.onBrandPrimary} />
            <Text style={styles.primaryBtnText}>NEW GAME</Text>
          </Pressable>
          <Pressable testID="reset-stats-btn" onPress={onResetStats} style={styles.secondaryBtn}>
            <Ionicons name="trash-outline" size={18} color={colors.onSurface} />
            <Text style={styles.secondaryBtnText}>RESET STATS</Text>
          </Pressable>
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
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    color: colors.onSurface,
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 3,
  },
  tagline: {
    color: colors.onSurfaceTertiary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    marginTop: 2,
  },
  infoBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSecondary,
  },
  controlsRow: {
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
  turnPill: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    backgroundColor: colors.surfaceSecondary,
    shadowRadius: 12,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 0 },
  },
  turnDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  turnText: {
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 2,
  },
  boardWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm,
  },
  actionsRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  primaryBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.brandPrimary,
  },
  primaryBtnText: {
    color: colors.onBrandPrimary,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 2,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryBtnText: {
    color: colors.onSurface,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 2,
  },
});
