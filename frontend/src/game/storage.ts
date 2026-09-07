// Statistics persisted via AsyncStorage (native equivalent of localStorage).
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@tictacai/stats/v1";

export type Stats = {
  playerWins: number;
  aiWins: number;
  draws: number;
  streak: number; // positive = player streak, negative = AI streak, 0 = broken by draw
};

export const DEFAULT_STATS: Stats = {
  playerWins: 0,
  aiWins: 0,
  draws: 0,
  streak: 0,
};

export async function loadStats(): Promise<Stats> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATS };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATS, ...parsed };
  } catch {
    return { ...DEFAULT_STATS };
  }
}

export async function saveStats(stats: Stats): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // ignore write errors — stats are non-critical
  }
}

export function updateStatsFor(
  stats: Stats,
  outcome: "player" | "ai" | "draw",
): Stats {
  if (outcome === "player") {
    return {
      ...stats,
      playerWins: stats.playerWins + 1,
      streak: stats.streak >= 0 ? stats.streak + 1 : 1,
    };
  }
  if (outcome === "ai") {
    return {
      ...stats,
      aiWins: stats.aiWins + 1,
      streak: stats.streak <= 0 ? stats.streak - 1 : -1,
    };
  }
  return { ...stats, draws: stats.draws + 1, streak: 0 };
}

export async function resetStats(): Promise<Stats> {
  await AsyncStorage.removeItem(STORAGE_KEY);
  return { ...DEFAULT_STATS };
}
