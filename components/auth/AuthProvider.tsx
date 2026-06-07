"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User, Session } from "@supabase/supabase-js";
import { createClientSafe } from "@/lib/supabase/client";
import { saveLocalProfile } from "@/lib/offline/local";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isEmailVerified } from "@/lib/auth/founder";
import { validateTouristEmail } from "@/lib/auth/email-validation";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  isVerified: boolean;
  signInWithGoogle: (next?: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithEmail: (
    email: string,
    password: string,
    meta?: { name?: string; nationality?: string }
  ) => Promise<{ error?: string; needsConfirmation?: boolean }>;
  signInWithMagicLink: (email: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resendVerification: (email: string) => Promise<{ error?: string }>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const isConfigured = isSupabaseConfigured();
  const isVerified = user ? isEmailVerified(user) : false;

  const syncLocal = useCallback((u: User | null) => {
    if (!u || !isEmailVerified(u)) return;
    const meta = u.user_metadata ?? {};
    saveLocalProfile({
      name:
        (meta.full_name as string) ||
        (meta.name as string) ||
        u.email?.split("@")[0] ||
        "Traveler",
      email: u.email,
      nationality: (meta.nationality as string) || undefined,
      createdAt: new Date().toISOString(),
    });
    fetch("/api/auth/sync-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: meta.full_name || meta.name,
        nationality: meta.nationality,
      }),
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const supabase = createClientSafe();
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) syncLocal(s.user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) syncLocal(s.user);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [syncLocal]);

  const signInWithGoogle = useCallback(async (next = "/map") => {
    const supabase = createClientSafe();
    if (!supabase) throw new Error("Supabase not configured");
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: { prompt: "select_account" },
      },
    });
    if (error) throw error;
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const supabase = createClientSafe();
    if (!supabase) return { error: "Supabase not configured" };

    const check = validateTouristEmail(email);
    if (!check.ok) return { error: check.message };

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };

    if (data.user && !isEmailVerified(data.user)) {
      await supabase.auth.signOut();
      return {
        error: "Verify your email first. Check your inbox for the confirmation link.",
      };
    }
    return {};
  }, []);

  const signUpWithEmail = useCallback(
    async (
      email: string,
      password: string,
      meta?: { name?: string; nationality?: string }
    ) => {
      const supabase = createClientSafe();
      if (!supabase) return { error: "Supabase not configured" };

      const check = validateTouristEmail(email);
      if (!check.ok) return { error: check.message };

      if (password.length < 8) {
        return { error: "Password must be at least 8 characters." };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: meta?.name,
            nationality: meta?.nationality,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/map`,
        },
      });
      if (error) return { error: error.message };
      return { needsConfirmation: !data.session || !data.user?.email_confirmed_at };
    },
    []
  );

  const signInWithMagicLink = useCallback(async (email: string) => {
    const supabase = createClientSafe();
    if (!supabase) return { error: "Supabase not configured" };

    const check = validateTouristEmail(email);
    if (!check.ok) return { error: check.message };

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/map`,
        shouldCreateUser: false,
      },
    });
    return error ? { error: error.message } : {};
  }, []);

  const resendVerification = useCallback(async (email: string) => {
    const supabase = createClientSafe();
    if (!supabase) return { error: "Supabase not configured" };
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/map`,
      },
    });
    return error ? { error: error.message } : {};
  }, []);

  const signOut = useCallback(async () => {
    const supabase = createClientSafe();
    if (supabase) await supabase.auth.signOut();
    window.location.href = "/";
  }, []);

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      isConfigured,
      isVerified,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      signInWithMagicLink,
      signOut,
      resendVerification,
    }),
    [
      user,
      session,
      loading,
      isConfigured,
      isVerified,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      signInWithMagicLink,
      signOut,
      resendVerification,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
