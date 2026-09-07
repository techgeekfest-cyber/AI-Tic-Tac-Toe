// Game rules: pure functions. No React, no side effects.
export type Player = "X" | "O";
export type Cell = Player | null;
export type Board = Cell[]; // length 9, indices 0..8 row-major

export const EMPTY_BOARD: Board = Array(9).fill(null);

export const WINNING_LINES: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // cols
  [0, 4, 8],
  [2, 4, 6], // diagonals
];

export type GameResult = {
  winner: Player | "DRAW" | null; // null = still playing
  line: number[] | null; // winning cells if any
};

export function evaluate(board: Board): GameResult {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return { winner: board[a] as Player, line };
    }
  }
  if (board.every((c) => c !== null)) return { winner: "DRAW", line: null };
  return { winner: null, line: null };
}

export function availableMoves(board: Board): number[] {
  const out: number[] = [];
  for (let i = 0; i < 9; i++) if (board[i] === null) out.push(i);
  return out;
}

export function opponent(p: Player): Player {
  return p === "X" ? "O" : "X";
}

export function applyMove(board: Board, index: number, player: Player): Board {
  const next = board.slice();
  next[index] = player;
  return next;
}
