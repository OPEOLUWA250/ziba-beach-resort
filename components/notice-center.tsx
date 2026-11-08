"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useIsClient } from "@/hooks/use-is-client";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";

/*
 * The site's replacement for the browser's alert(), confirm() and prompt():
 *   notify.success("Saved") / notify.error("…") / notify.info("…")  → a card that slides in
 *   await confirmCard({ title, message, confirmLabel, destructive }) → true / false
 *   await promptCard({ title, message, placeholder })               → text or null
 * <NoticeHost /> (mounted once in the root layout) draws them.
 */

type Tone = "success" | "error" | "info";
interface Toast {
  id: number;
  tone: Tone;
  title: string;
  message?: string;
}
interface DialogRequest {
  kind: "confirm" | "prompt";
  title: string;
  message?: string;
  confirmLabel: string;
  cancelLabel: string;
  destructive: boolean;
  placeholder?: string;
  defaultValue?: string;
  multiline?: boolean;
  resolve: (value: boolean | string | null) => void;
}

let toasts: Toast[] = [];
let dialog: DialogRequest | null = null;
let nextId = 1;
const listeners = new Set<() => void>();
// One object per change, so React sees a stable snapshot between changes.
let state: { toasts: Toast[]; dialog: DialogRequest | null } = { toasts, dialog };
const SERVER_STATE = { toasts: [] as Toast[], dialog: null as DialogRequest | null };
const emit = () => {
  state = { toasts, dialog };
  listeners.forEach((l) => l());
};
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

function push(tone: Tone, title: string, message?: string, ms = tone === "error" ? 7000 : 4500) {
  const id = nextId++;
  toasts = [...toasts.slice(-3), { id, tone, title, message }];
  emit();
  setTimeout(() => dismiss(id), ms);
  return id;
}

function dismiss(id: number) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

export const notify = {
  success: (title: string, message?: string) => push("success", title, message),
  error: (title: string, message?: string) => push("error", title, message),
  info: (title: string, message?: string) => push("info", title, message),
};

export function confirmCard(opts: {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}): Promise<boolean> {
  return new Promise((resolve) => {
    dialog = {
      kind: "confirm",
      title: opts.title,
      message: opts.message,
      confirmLabel: opts.confirmLabel ?? "Confirm",
      cancelLabel: opts.cancelLabel ?? "Cancel",
      destructive: opts.destructive ?? false,
      resolve: (v) => resolve(v === true),
    };
    emit();
  });
}

export function promptCard(opts: {
  title: string;
  message?: string;
  placeholder?: string;
  defaultValue?: string;
  confirmLabel?: string;
  multiline?: boolean;
}): Promise<string | null> {
  return new Promise((resolve) => {
    dialog = {
      kind: "prompt",
      title: opts.title,
      message: opts.message,
      placeholder: opts.placeholder,
      defaultValue: opts.defaultValue,
      multiline: opts.multiline ?? true,
      confirmLabel: opts.confirmLabel ?? "Save",
      cancelLabel: "Cancel",
      destructive: false,
      resolve: (v) => resolve(typeof v === "string" ? v : null),
    };
    emit();
  });
}

function closeDialog(value: boolean | string | null) {
  const current = dialog;
  dialog = null;
  emit();
  current?.resolve(value);
}

const TONES: Record<Tone, { icon: typeof Info; ring: string; iconColor: string }> = {
  success: { icon: CheckCircle2, ring: "ring-emerald-100", iconColor: "text-emerald-600" },
  error: { icon: XCircle, ring: "ring-rose-100", iconColor: "text-rose-600" },
  info: { icon: Info, ring: "ring-blue-100", iconColor: "text-blue-700" },
};

function DialogCard({ request }: { request: DialogRequest }) {
  const [value, setValue] = useState(request.defaultValue ?? "");
  const inputRef = useRef<HTMLTextAreaElement & HTMLInputElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    (request.kind === "prompt" ? inputRef.current : confirmRef.current)?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDialog(request.kind === "prompt" ? null : false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [request]);

  const submit = () => closeDialog(request.kind === "prompt" ? value : true);
  const Icon = request.destructive ? AlertTriangle : Info;

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center p-4 sm:items-center">
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] animate-[noticeFade_150ms_ease-out]"
        onClick={() => closeDialog(request.kind === "prompt" ? null : false)}
        aria-hidden="true"
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="notice-dialog-title"
        className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-[0_30px_80px_-20px_rgba(2,6,23,0.45)] animate-[noticeUp_200ms_ease-out] sm:p-7"
      >
        <div className="flex gap-4">
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
              request.destructive ? "bg-rose-50 text-rose-600" : "bg-blue-50 text-blue-800"
            }`}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="notice-dialog-title" className="font-cormorant text-2xl font-medium leading-snug text-slate-900">
              {request.title}
            </h2>
            {request.message && <p className="mt-1.5 text-sm font-light leading-relaxed text-slate-600">{request.message}</p>}
          </div>
        </div>

        {request.kind === "prompt" &&
          (request.multiline ? (
            <textarea
              ref={inputRef}
              rows={3}
              value={value}
              placeholder={request.placeholder}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
              }}
              className="mt-5 w-full rounded-2xl border border-slate-300 px-4 py-3 text-[15px] text-slate-900 outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10"
            />
          ) : (
            <input
              ref={inputRef}
              value={value}
              placeholder={request.placeholder}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              className="mt-5 w-full rounded-2xl border border-slate-300 px-4 py-3 text-[15px] text-slate-900 outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10"
            />
          ))}

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => closeDialog(request.kind === "prompt" ? null : false)}
            className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-500"
          >
            {request.cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={submit}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold text-white transition ${
              request.destructive ? "bg-rose-600 hover:bg-rose-700" : "bg-blue-950 hover:bg-blue-900"
            }`}
          >
            {request.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NoticeHost() {
  const snapshot = useSyncExternalStore(
    subscribe,
    () => state,
    () => SERVER_STATE,
  );
  const mounted = useIsClient();
  if (!mounted) return null;

  return createPortal(
    <>
      <div
        className="pointer-events-none fixed inset-x-0 top-4 z-[130] flex flex-col items-center gap-2 px-4 sm:top-6"
        aria-live="polite"
        aria-atomic="false"
      >
        {snapshot.toasts.map((t) => {
          const { icon: Icon, ring, iconColor } = TONES[t.tone];
          return (
            <div
              key={t.id}
              role={t.tone === "error" ? "alert" : "status"}
              className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl bg-white p-4 shadow-[0_20px_50px_-15px_rgba(2,6,23,0.35)] ring-1 ${ring} animate-[noticeDown_220ms_ease-out]`}
            >
              <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconColor}`} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-900">{t.title}</p>
                {t.message && <p className="mt-0.5 text-sm font-light text-slate-600">{t.message}</p>}
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="-m-1 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
      {snapshot.dialog && <DialogCard key={snapshot.dialog.title + snapshot.dialog.kind} request={snapshot.dialog} />}
      <style>{`
        @keyframes noticeDown{from{opacity:0;transform:translateY(-10px) scale(.98)}to{opacity:1;transform:none}}
        @keyframes noticeUp{from{opacity:0;transform:translateY(14px) scale(.98)}to{opacity:1;transform:none}}
        @keyframes noticeFade{from{opacity:0}to{opacity:1}}
        @media (prefers-reduced-motion:reduce){[class*="animate-[notice"]{animation:none!important}}
      `}</style>
    </>,
    document.body,
  );
}
