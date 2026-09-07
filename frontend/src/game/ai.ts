// AI opponent: Minimax with alpha-beta pruning + Easy/Medium/Hard tiers.
// Also derives a human-readable explanation from the actual decision.
import {
  Board,
  Player,
  applyMove,
  availableMoves,
  evaluate,
  opponent,
  WINNING_LINES,
} from "./rules";

export type Difficulty = "easy" | "medium" | "hard";

export type AIMove = {
  index: number;
  explanation: string;
};

// ---- Minimax with alpha-beta pruning ----
// Returns score from the perspective of aiPlayer: +10 win, -10 loss, 0 draw,
// adjusted by depth so faster wins & slower losses are preferred.
function minimax(
  board: Board,
  toMove: Player,
  aiPlayer: Player,
  depth: number,
  alpha: number,
  beta: number,
): number {
  const { winner } = evaluate(board);
  if (winner === aiPlayer) return 10 - depth;
  if (winner === opponent(aiPlayer)) return depth - 10;
  if (winner === "DRAW") return 0;

  const moves = availableMoves(board);
  if (toMove === aiPlayer) {
    let best = -Infinity;
    for (const m of moves) {
      const score = minimax(
        applyMove(board, m, toMove),
        opponent(toMove),
        aiPlayer,
        depth + 1,
        alpha,
        beta,
      );
      best = Math.max(best, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const m of moves) {
      const score = minimax(
        applyMove(board, m, toMove),
        opponent(toMove),
        aiPlayer,
        depth + 1,
        alpha,
        beta,
      );
      best = Math.min(best, score);
      beta = Math.min(beta, score);
      if (beta <= alpha) break;
    }
    return best;
  }
}

function bestMinimaxMove(board: Board, aiPlayer: Player): { index: number; score: number } {
  let bestScore = -Infinity;
  let bestIndex = -1;
  for (const m of availableMoves(board)) {
    const score = minimax(
      applyMove(board, m, aiPlayer),
      opponent(aiPlayer),
      aiPlayer,
      1,
      -Infinity,
      Infinity,
    );
    if (score > bestScore) {
      bestScore = score;
      bestIndex = m;
    }
  }
  return { index: bestIndex, score: bestScore };
}

// ---- Explanation helpers ----
// Detect if placing `player` at `index` immediately wins.
function winsWith(board: Board, index: number, player: Player): boolean {
  return evaluate(applyMove(board, index, player)).winner === player;
}

// Return cells where `player` has 2-in-a-row with the 3rd cell empty (threats).
function threats(board: Board, player: Player): number[] {
  const out: number[] = [];
  for (const line of WINNING_LINES) {
    const cells = line.map((i) => board[i]);
    const count = cells.filter((c) => c === player).length;
    const empty = cells.filter((c) => c === null).length;
    if (count === 2 && empty === 1) {
      const emptyIdx = line[cells.indexOf(null)];
      out.push(emptyIdx);
    }
  }
  return out;
}

// Count how many winning lines still open for player after they take `index`.
function forkOpportunities(board: Board, index: number, player: Player): number {
  const next = applyMove(board, index, player);
  return threats(next, player).length;
}

function positionName(index: number): string {
  const map: Record<number, string> = {
    0: "top-left",
    1: "top",
    2: "top-right",
    3: "left",
    4: "center",
    5: "right",
    6: "bottom-left",
    7: "bottom",
    8: "bottom-right",
  };
  return map[index] ?? `cell ${index}`;
}

function explain(board: Board, index: number, aiPlayer: Player): string {
  const humanPlayer = opponent(aiPlayer);
  const pos = positionName(index);

  if (winsWith(board, index, aiPlayer)) {
    return `AI played ${pos} to complete a winning line.`;
  }
  // Was there a human threat that this move blocks?
  const humanThreats = threats(board, humanPlayer);
  if (humanThreats.includes(index)) {
    return `AI blocked your winning move at ${pos}.`;
  }
  // Does this create a fork (2+ threats)?
  const forks = forkOpportunities(board, index, aiPlayer);
  if (forks >= 2) {
    return `AI played ${pos} to create a fork — two winning threats at once.`;
  }
  if (forks === 1) {
    return `AI played ${pos} to set up a winning threat.`;
  }
  // Opening theory hints
  const isEmpty = board.every((c) => c === null);
  if (isEmpty && index === 4) {
    return `AI took the center — the strongest opening square.`;
  }
  if (index === 4) {
    return `AI took the center to maximize board control.`;
  }
  if ([0, 2, 6, 8].includes(index)) {
    return `AI took the ${pos} corner — corners open the most winning lines.`;
  }
  return `AI played ${pos} as the strategically strongest option.`;
}

// ---- Difficulty tiers ----
function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function pickAIMove(
  board: Board,
  aiPlayer: Player,
  difficulty: Difficulty,
): AIMove {
  const moves = availableMoves(board);
  if (moves.length === 0) return { index: -1, explanation: "" };

  // Easy: mostly random (85% random, 15% optimal so it isn't pathetic).
  if (difficulty === "easy") {
    if (Math.random() < 0.85) {
      const idx = randomChoice(moves);
      return {
        index: idx,
        explanation: `AI (Easy) picked ${positionName(idx)} — mostly random play.`,
      };
    }
    const best = bestMinimaxMove(board, aiPlayer);
    return { index: best.index, explanation: explain(board, best.index, aiPlayer) };
  }

  // Medium: always take immediate wins & blocks; otherwise 60% optimal / 40% random.
  if (difficulty === "medium") {
    // 1) Win now if possible
    for (const m of moves) if (winsWith(board, m, aiPlayer)) {
      return { index: m, explanation: explain(board, m, aiPlayer) };
    }
    // 2) Block human's immediate win
    const humanThreats = threats(board, opponent(aiPlayer));
    if (humanThreats.length > 0) {
      const m = humanThreats[0];
      return { index: m, explanation: explain(board, m, aiPlayer) };
    }
    if (Math.random() < 0.6) {
      const best = bestMinimaxMove(board, aiPlayer);
      return { index: best.index, explanation: explain(board, best.index, aiPlayer) };
    }
    const idx = randomChoice(moves);
    return {
      index: idx,
      explanation: `AI (Medium) picked ${positionName(idx)} — mixing strategy with variation.`,
    };
  }

  // Hard: full Minimax with alpha-beta pruning.
  const best = bestMinimaxMove(board, aiPlayer);
  return { index: best.index, explanation: explain(board, best.index, aiPlayer) };
}
