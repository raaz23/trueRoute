import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grain flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <Link
        href="/"
        className="mb-10 flex items-center gap-2 font-display text-xl font-semibold text-[var(--text)]"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#D4A017] to-[#A87C10] text-sm shadow-lg">
          🧭
        </span>
        True<span className="text-[var(--gold)]">Route</span>
      </Link>
      <div className="w-full max-w-[400px]">{children}</div>
    </div>
  );
}
