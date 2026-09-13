"use client";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
export function CommandCenter() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, []);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] bg-black/20 p-4 backdrop-blur-sm">
      <div className="mx-auto mt-[12vh] max-w-xl overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-2xl">
        <div className="flex items-center gap-3 border-b border-[var(--line)] px-4 py-4">
          <Search size={18} className="text-neutral-400" />
          <input
            autoFocus
            placeholder="What do you want to do?"
            className="w-full bg-transparent outline-none"
          />
        </div>
        <div className="p-3">
          <div className="px-2 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Jump to
          </div>
          {[
            ["/dashboard", "Continue learning"],
            ["/quick-learn", "Analyze a video"],
            ["/knowledge-map", "Open Knowledge Map"],
            ["/paths", "Open Learning Paths"],
          ].map(([href, label]) => (
            <Link
              key={href}
              onClick={() => setOpen(false)}
              href={href}
              className="block rounded-xl px-3 py-3 text-sm hover:bg-neutral-50"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
