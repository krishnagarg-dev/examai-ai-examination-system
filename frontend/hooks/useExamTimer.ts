"use client";

import { useEffect, useState } from "react";

export function useExamTimer(initialSeconds: number, enabled: boolean, onExpire: () => void) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => setTimeLeft(initialSeconds), [initialSeconds]);

  useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(() => {
      setTimeLeft((value) => {
        if (value <= 1) {
          window.clearInterval(id);
          onExpire();
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [enabled, onExpire]);

  return timeLeft;
}
