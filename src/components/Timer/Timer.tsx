"use client";

export default function Timer({ seconds }: { seconds: number }) {
  const mm = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const ss = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return (
    <span aria-live="polite" aria-label={`Time remaining ${mm}:${ss}`}>
      ⏱ {mm}:{ss}
    </span>
  );
}
