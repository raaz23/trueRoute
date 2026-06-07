"use client";

import { useEffect, useState } from "react";
import { getSessionId } from "@/lib/offline/local";

export function useSessionId() {
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  return sessionId;
}

export function sessionHeaders(): HeadersInit {
  const id = typeof window !== "undefined" ? getSessionId() : "";
  return id ? { "x-session-id": id } : {};
}
