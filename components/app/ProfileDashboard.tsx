"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Camera,
  Copy,
  Heart,
  Lock,
  MapPin,
  Share2,
  StickyNote,
  UserRound,
} from "lucide-react";
import OfflineDownloadCard from "@/components/shared/OfflineDownloadCard";

type TabId =
  | "account"
  | "saved"
  | "notes"
  | "adventures"
  | "share"
  | "private";

const LS = {
  name: "trueroute_profile_name",
  avatar: "trueroute_profile_avatar",
  places: "trueroute_saved_places",
  notes: "trueroute_travel_notes",
  photos: "trueroute_adventure_photos",
  vault: "trueroute_private_vault",
} as const;

type SavedPlace = { id: string; name: string; slug?: string };
type TravelNote = { id: string; title: string; body: string; updated: string };
type AdventurePhoto = { id: string; caption: string; dataUrl: string };
type PrivateVault = {
  bloodType: string;
  allergies: string;
  medications: string;
  conditions: string;
  iceName: string;
  icePhone: string;
  iceRelation: string;
  privateJournal: string;
};

const emptyVault: PrivateVault = {
  bloodType: "",
  allergies: "",
  medications: "",
  conditions: "",
  iceName: "",
  icePhone: "",
  iceRelation: "",
  privateJournal: "",
};

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "account", label: "Account", icon: <UserRound className="h-4 w-4" /> },
  { id: "saved", label: "Saved places", icon: <MapPin className="h-4 w-4" /> },
  { id: "notes", label: "Notes", icon: <StickyNote className="h-4 w-4" /> },
  { id: "adventures", label: "Adventures", icon: <Camera className="h-4 w-4" /> },
  { id: "share", label: "Share", icon: <Share2 className="h-4 w-4" /> },
  { id: "private", label: "Private essentials", icon: <Lock className="h-4 w-4" /> },
];

export default function ProfileDashboard() {
  const [tab, setTab] = useState<TabId>("account");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
  const [newPlace, setNewPlace] = useState("");
  const [notes, setNotes] = useState<TravelNote[]>([]);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [photos, setPhotos] = useState<AdventurePhoto[]>([]);
  const [vault, setVault] = useState<PrivateVault>(emptyVault);
  const [shareHint, setShareHint] = useState<string | null>(null);

  useEffect(() => {
    setName(localStorage.getItem(LS.name) || "");
    setAvatar(localStorage.getItem(LS.avatar));
    setSavedPlaces(readJson(LS.places, []));
    setNotes(readJson(LS.notes, []));
    setPhotos(readJson(LS.photos, []));
    setVault({ ...emptyVault, ...readJson<Partial<PrivateVault>>(LS.vault, {}) });
  }, []);

  const persistName = useCallback(() => {
    localStorage.setItem(LS.name, name.trim());
    setShareHint("Display name saved on this device.");
    setTimeout(() => setShareHint(null), 2500);
  }, [name]);

  const onAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 900_000) {
      setShareHint("Please use an image under ~900KB for now.");
      setTimeout(() => setShareHint(null), 3000);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as string;
      localStorage.setItem(LS.avatar, data);
      setAvatar(data);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const savePasswordUi = () => {
    if (!pwNew || pwNew !== pwConfirm) {
      setShareHint("New password and confirmation must match.");
      setTimeout(() => setShareHint(null), 2500);
      return;
    }
    setPwCurrent("");
    setPwNew("");
    setPwConfirm("");
    setShareHint(
      "For your safety we never store passwords in the browser. Full account security arrives in Phase 2 with the server."
    );
    setTimeout(() => setShareHint(null), 4000);
  };

  const addPlace = () => {
    const t = newPlace.trim();
    if (!t) return;
    const next = [...savedPlaces, { id: crypto.randomUUID(), name: t }];
    setSavedPlaces(next);
    writeJson(LS.places, next);
    setNewPlace("");
  };

  const removePlace = (id: string) => {
    const next = savedPlaces.filter((p) => p.id !== id);
    setSavedPlaces(next);
    writeJson(LS.places, next);
  };

  const addNote = () => {
    const title = noteTitle.trim() || "Untitled";
    const body = noteBody.trim();
    if (!body) return;
    const n: TravelNote = {
      id: crypto.randomUUID(),
      title,
      body,
      updated: new Date().toISOString(),
    };
    const next = [n, ...notes];
    setNotes(next);
    writeJson(LS.notes, next);
    setNoteTitle("");
    setNoteBody("");
  };

  const deleteNote = (id: string) => {
    const next = notes.filter((x) => x.id !== id);
    setNotes(next);
    writeJson(LS.notes, next);
  };

  const onAdventureFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 8);
    const remaining = Math.max(0, 12 - photos.length);
    const take = files.slice(0, remaining);
    take.forEach((file) => {
      if (!file.type.startsWith("image/") || file.size > 1_200_000) return;
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setPhotos((prev) => {
          const next: AdventurePhoto[] = [
            ...prev,
            { id: crypto.randomUUID(), caption: file.name, dataUrl },
          ].slice(0, 12);
          writeJson(LS.photos, next);
          return next;
        });
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removePhoto = (id: string) => {
    const next = photos.filter((p) => p.id !== id);
    setPhotos(next);
    writeJson(LS.photos, next);
  };

  const persistVault = () => {
    writeJson(LS.vault, vault);
    setShareHint("Private essentials saved only on this device.");
    setTimeout(() => setShareHint(null), 2500);
  };

  const clearVault = () => {
    if (!confirm("Erase all private essentials on this device?")) return;
    setVault(emptyVault);
    localStorage.removeItem(LS.vault);
    setShareHint("Private essentials cleared.");
    setTimeout(() => setShareHint(null), 2500);
  };

  const shareProfile = async () => {
    const text = `TrueRoute — ${name.trim() || "Traveler"}'s profile (local preview)`;
    const url = typeof window !== "undefined" ? window.location.origin + "/profile" : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: "TrueRoute profile", text, url });
        setShareHint("Shared.");
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        setShareHint("Link copied to clipboard.");
      }
    } catch {
      setShareHint("Could not share — try copy manually.");
    }
    setTimeout(() => setShareHint(null), 2500);
  };

  const copyProfileLink = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    void navigator.clipboard.writeText(url);
    setShareHint("Profile page link copied.");
    setTimeout(() => setShareHint(null), 2500);
  };

  const displayInitial = useMemo(
    () => (name.trim().charAt(0) || "?").toUpperCase(),
    [name]
  );

  return (
    <div className="space-y-6">
      <OfflineDownloadCard />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Your profile</h1>
          <p className="mt-1 max-w-xl text-[14px] text-[var(--text-muted)]">
            Manage how you show up, keep trip notes and photos, and store{" "}
            <strong className="text-[var(--text-mid)]">private</strong> medical &amp; emergency
            details only on this device until accounts sync in Phase 2.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-[13px]">
          <Link
            href="/map"
            className="rounded-xl border border-white/12 px-4 py-2 font-medium text-[var(--text)] hover:bg-white/5"
          >
            Map
          </Link>
          <Link
            href="/places"
            className="rounded-xl border border-white/12 px-4 py-2 font-medium text-[var(--text)] hover:bg-white/5"
          >
            Places
          </Link>
          <Link
            href="/chat"
            className="rounded-xl border border-white/12 px-4 py-2 font-medium text-[var(--text)] hover:bg-white/5"
          >
            AI guide
          </Link>
        </div>
      </div>

      {shareHint && (
        <div className="rounded-xl border border-[var(--gold)]/25 bg-[var(--gold-muted)] px-4 py-3 text-[13px] text-[var(--text)]">
          {shareHint}
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-1 md:flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-medium transition-colors ${
              tab === t.id
                ? "bg-[var(--gold-muted)] text-[var(--gold)]"
                : "border border-white/10 bg-[var(--bg-card)] text-[var(--text-muted)] hover:border-white/20 hover:text-[var(--text)]"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-[var(--bg-card)] p-5 md:p-8">
        {tab === "account" && (
          <div className="space-y-8">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              <div className="relative">
                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-[var(--gold)]/35 bg-[var(--bg)] text-3xl font-bold text-[var(--gold)]">
                  {avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatar} alt="" className="h-full w-full object-cover" />
                  ) : (
                    displayInitial
                  )}
                </div>
                <label className="absolute bottom-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-[var(--bg-card)] text-[var(--gold)] shadow-lg hover:bg-white/5">
                  <Camera className="h-4 w-4" />
                  <input type="file" accept="image/*" className="hidden" onChange={onAvatar} />
                </label>
              </div>
              <div className="min-w-0 flex-1 space-y-3">
                <label className="text-[12px] font-medium text-[var(--text-mid)]">
                  Display name
                </label>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="How should we call you?"
                    className="w-full rounded-xl border border-white/10 bg-[var(--bg)] px-4 py-3 text-[14px] outline-none ring-[var(--gold)]/30 focus:ring-2"
                  />
                  <button
                    type="button"
                    onClick={persistName}
                    className="cursor-pointer shrink-0 rounded-xl bg-gradient-to-r from-[#D4A017] to-[#A87C10] px-5 py-3 text-[14px] font-semibold text-white"
                  >
                    Save name
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-white/8 pt-8">
              <h2 className="font-display text-xl font-semibold">Update password</h2>
              <p className="mt-1 text-[13px] text-[var(--text-muted)]">
                Passwords are not kept in the browser in plain text. Use this flow once server
                auth is live; for now it confirms your intent safely.
              </p>
              <div className="mt-4 grid max-w-md gap-3">
                <input
                  type="password"
                  autoComplete="current-password"
                  placeholder="Current password (optional)"
                  value={pwCurrent}
                  onChange={(e) => setPwCurrent(e.target.value)}
                  className="rounded-xl border border-white/10 bg-[var(--bg)] px-4 py-3 text-[14px] outline-none ring-[var(--gold)]/30 focus:ring-2"
                />
                <input
                  type="password"
                  autoComplete="new-password"
                  placeholder="New password"
                  value={pwNew}
                  onChange={(e) => setPwNew(e.target.value)}
                  className="rounded-xl border border-white/10 bg-[var(--bg)] px-4 py-3 text-[14px] outline-none ring-[var(--gold)]/30 focus:ring-2"
                />
                <input
                  type="password"
                  autoComplete="new-password"
                  placeholder="Confirm new password"
                  value={pwConfirm}
                  onChange={(e) => setPwConfirm(e.target.value)}
                  className="rounded-xl border border-white/10 bg-[var(--bg)] px-4 py-3 text-[14px] outline-none ring-[var(--gold)]/30 focus:ring-2"
                />
                <button
                  type="button"
                  onClick={savePasswordUi}
                  className="cursor-pointer rounded-xl border border-white/15 px-5 py-3 text-[14px] font-semibold text-[var(--text)] hover:bg-white/5"
                >
                  Confirm password change (Phase 2)
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === "saved" && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-semibold">Saved places</h2>
            <p className="text-[13px] text-[var(--text-muted)]">
              Quick list for this device — tap a curated place from{" "}
              <Link href="/places" className="text-[var(--gold)] underline">
                Places
              </Link>{" "}
              and add the name here if you like.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                value={newPlace}
                onChange={(e) => setNewPlace(e.target.value)}
                placeholder="e.g. Boudhanath at dawn"
                className="w-full rounded-xl border border-white/10 bg-[var(--bg)] px-4 py-3 text-[14px] outline-none ring-[var(--gold)]/30 focus:ring-2"
              />
              <button
                type="button"
                onClick={addPlace}
                className="cursor-pointer shrink-0 rounded-xl bg-gradient-to-r from-[#D4A017] to-[#A87C10] px-5 py-3 text-[14px] font-semibold text-white"
              >
                Add
              </button>
            </div>
            <ul className="space-y-2">
              {savedPlaces.length === 0 && (
                <li className="text-[14px] text-[var(--text-muted)]">No saved places yet.</li>
              )}
              {savedPlaces.map((p) => (
                <li
                  key={p.id}
                  className="flex cursor-pointer items-center justify-between rounded-xl border border-white/8 bg-[var(--bg)] px-4 py-3 transition-colors hover:border-[var(--gold)]/25"
                >
                  <span className="text-[14px] font-medium">{p.name}</span>
                  <button
                    type="button"
                    onClick={() => removePlace(p.id)}
                    className="cursor-pointer text-[12px] text-[var(--red)] hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === "notes" && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-semibold">Travel notes</h2>
            <p className="text-[13px] text-[var(--text-muted)]">
              Trip reminders, hotel confirmation snippets, phrases — stored on this device.
            </p>
            <input
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="Note title"
              className="w-full rounded-xl border border-white/10 bg-[var(--bg)] px-4 py-3 text-[14px] outline-none ring-[var(--gold)]/30 focus:ring-2"
            />
            <textarea
              value={noteBody}
              onChange={(e) => setNoteBody(e.target.value)}
              placeholder="Write your note…"
              rows={4}
              className="w-full resize-y rounded-xl border border-white/10 bg-[var(--bg)] px-4 py-3 text-[14px] outline-none ring-[var(--gold)]/30 focus:ring-2"
            />
            <button
              type="button"
              onClick={addNote}
              className="cursor-pointer rounded-xl bg-gradient-to-r from-[#D4A017] to-[#A87C10] px-5 py-3 text-[14px] font-semibold text-white"
            >
              Save note
            </button>
            <ul className="mt-6 space-y-2">
              {notes.map((n) => (
                <li
                  key={n.id}
                  className="cursor-pointer rounded-xl border border-white/8 bg-[var(--bg)] p-4 transition-colors hover:border-[var(--gold)]/30"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-display text-[16px] font-semibold">{n.title}</div>
                      <div className="mt-1 whitespace-pre-wrap text-[13px] text-[var(--text-muted)]">
                        {n.body}
                      </div>
                      <div className="mt-2 text-[11px] text-[var(--text-muted)]">
                        {new Date(n.updated).toLocaleString()}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(n.id);
                      }}
                      className="cursor-pointer shrink-0 text-[12px] text-[var(--red)] hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === "adventures" && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-semibold">Adventure pictures</h2>
            <p className="text-[13px] text-[var(--text-muted)]">
              Upload moments from the trail (kept in this browser only, max 12 thumbnails). Clear
              before lending your phone.
            </p>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[var(--gold)]/40 bg-[var(--gold-muted)] px-5 py-4 text-[14px] font-medium text-[var(--gold)] hover:bg-[var(--gold-muted)]/80">
              <Camera className="h-4 w-4" />
              Upload photos
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={onAdventureFiles}
              />
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {photos.map((p) => (
                <div
                  key={p.id}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-white/10"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.dataUrl} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(p.id)}
                    className="absolute right-2 top-2 cursor-pointer rounded-lg bg-black/60 px-2 py-1 text-[11px] text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    Remove
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 truncate bg-black/55 px-2 py-1 text-[10px] text-white/90">
                    {p.caption}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "share" && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-semibold">Share profile</h2>
            <p className="text-[13px] text-[var(--text-muted)]">
              Share your traveler card link or copy it. Public social profiles come later; this
              is a lightweight handoff for friends you trust.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={shareProfile}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-[#D4A017] to-[#A87C10] px-5 py-3 text-[14px] font-semibold text-white"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
              <button
                type="button"
                onClick={copyProfileLink}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-[14px] font-semibold text-[var(--text)] hover:bg-white/5"
              >
                <Copy className="h-4 w-4" />
                Copy link
              </button>
            </div>
          </div>
        )}

        {tab === "private" && (
          <div className="space-y-6">
            <div className="flex items-start gap-3 rounded-xl border border-[var(--teal)]/25 bg-[var(--teal-muted)] p-4">
              <Lock className="mt-0.5 h-5 w-5 shrink-0 text-[var(--teal)]" />
              <div>
                <h2 className="font-display text-xl font-semibold text-[var(--text)]">
                  Private essentials
                </h2>
                <p className="mt-1 text-[13px] leading-relaxed text-[var(--text-mid)]">
                  Most travelers want a <strong>private</strong> place for blood type, allergies,
                  medications, and who to call in an emergency — without posting it on social
                  media. This vault stays <strong>only in this browser</strong> until encrypted
                  sync ships. Not sent to our servers today.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-[12px] font-medium text-[var(--text-mid)]">Blood type</label>
                <input
                  value={vault.bloodType}
                  onChange={(e) => setVault((v) => ({ ...v, bloodType: e.target.value }))}
                  placeholder="e.g. O+"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[var(--bg)] px-4 py-3 text-[14px] outline-none ring-[var(--gold)]/30 focus:ring-2"
                />
              </div>
              <div>
                <label className="text-[12px] font-medium text-[var(--text-mid)]">
                  ICE contact name
                </label>
                <input
                  value={vault.iceName}
                  onChange={(e) => setVault((v) => ({ ...v, iceName: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[var(--bg)] px-4 py-3 text-[14px] outline-none ring-[var(--gold)]/30 focus:ring-2"
                />
              </div>
              <div>
                <label className="text-[12px] font-medium text-[var(--text-mid)]">
                  ICE phone (with country code)
                </label>
                <input
                  value={vault.icePhone}
                  onChange={(e) => setVault((v) => ({ ...v, icePhone: e.target.value }))}
                  placeholder="+977…"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[var(--bg)] px-4 py-3 text-[14px] outline-none ring-[var(--gold)]/30 focus:ring-2"
                />
              </div>
              <div>
                <label className="text-[12px] font-medium text-[var(--text-mid)]">Relationship</label>
                <input
                  value={vault.iceRelation}
                  onChange={(e) => setVault((v) => ({ ...v, iceRelation: e.target.value }))}
                  placeholder="Partner / parent / friend"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-[var(--bg)] px-4 py-3 text-[14px] outline-none ring-[var(--gold)]/30 focus:ring-2"
                />
              </div>
            </div>

            <div>
              <label className="text-[12px] font-medium text-[var(--text-mid)]">Allergies</label>
              <textarea
                value={vault.allergies}
                onChange={(e) => setVault((v) => ({ ...v, allergies: e.target.value }))}
                rows={2}
                className="mt-1 w-full rounded-xl border border-white/10 bg-[var(--bg)] px-4 py-3 text-[14px] outline-none ring-[var(--gold)]/30 focus:ring-2"
              />
            </div>
            <div>
              <label className="text-[12px] font-medium text-[var(--text-mid)]">Medications</label>
              <textarea
                value={vault.medications}
                onChange={(e) => setVault((v) => ({ ...v, medications: e.target.value }))}
                rows={2}
                className="mt-1 w-full rounded-xl border border-white/10 bg-[var(--bg)] px-4 py-3 text-[14px] outline-none ring-[var(--gold)]/30 focus:ring-2"
              />
            </div>
            <div>
              <label className="text-[12px] font-medium text-[var(--text-mid)]">
                Medical conditions (optional)
              </label>
              <textarea
                value={vault.conditions}
                onChange={(e) => setVault((v) => ({ ...v, conditions: e.target.value }))}
                rows={2}
                className="mt-1 w-full rounded-xl border border-white/10 bg-[var(--bg)] px-4 py-3 text-[14px] outline-none ring-[var(--gold)]/30 focus:ring-2"
              />
            </div>
            <div>
              <label className="text-[12px] font-medium text-[var(--text-mid)]">
                Private journal (only for you)
              </label>
              <textarea
                value={vault.privateJournal}
                onChange={(e) => setVault((v) => ({ ...v, privateJournal: e.target.value }))}
                rows={4}
                placeholder="Anything you want documented privately — never shared."
                className="mt-1 w-full rounded-xl border border-white/10 bg-[var(--bg)] px-4 py-3 text-[14px] outline-none ring-[var(--gold)]/30 focus:ring-2"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={persistVault}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-[#D4A017] to-[#A87C10] px-5 py-3 text-[14px] font-semibold text-white"
              >
                <Heart className="h-4 w-4" />
                Save private essentials
              </button>
              <button
                type="button"
                onClick={clearVault}
                className="cursor-pointer rounded-xl border border-[var(--red)]/35 px-5 py-3 text-[14px] font-semibold text-[var(--red)] hover:bg-[var(--red-muted)]"
              >
                Erase all
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
