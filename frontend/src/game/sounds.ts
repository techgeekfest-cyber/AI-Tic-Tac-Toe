// Sound effects using expo-audio. Sources: freely-licensed mixkit preview MP3s.
// Wrapped defensively so playback failures never crash the game loop.
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from "expo-audio";

type SfxKey = "tap" | "aiMove" | "win" | "lose" | "draw";

const SOURCES: Record<SfxKey, string> = {
  tap: "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3",
  aiMove: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3",
  win: "https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3",
  lose: "https://assets.mixkit.co/active_storage/sfx/2020/2020-preview.mp3",
  draw: "https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3",
};

const players: Partial<Record<SfxKey, AudioPlayer>> = {};
let initialized = false;

async function ensureInitialized() {
  if (initialized) return;
  initialized = true;
  try {
    await setAudioModeAsync({ playsInSilentMode: false, shouldPlayInBackground: false });
    (Object.keys(SOURCES) as SfxKey[]).forEach((k) => {
      try {
        const p = createAudioPlayer({ uri: SOURCES[k] });
        p.volume = 0.7;
        players[k] = p;
      } catch {
        // one bad source shouldn't take down the rest
      }
    });
  } catch {
    // audio init failed — game still runs silently
  }
}

export async function play(key: SfxKey) {
  await ensureInitialized();
  const p = players[key];
  if (!p) return;
  try {
    p.seekTo(0);
    p.play();
  } catch {
    // ignore
  }
}

export function unloadAll() {
  (Object.keys(players) as SfxKey[]).forEach((k) => {
    try {
      players[k]?.remove();
    } catch {
      // ignore
    }
    delete players[k];
  });
  initialized = false;
}
