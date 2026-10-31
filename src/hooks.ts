import { useEffect } from "react";

// Close on Escape and lock background scrolling while a modal is open
export function useModal(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);
}

export const OPEN_CHAT_EVENT = "ottc:open-chat";
export const openChat = () => window.dispatchEvent(new Event(OPEN_CHAT_EVENT));

// Accepts Nepali/international formats like +977-9804853916, 9804853916, 041-523123
export function isValidPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return /^[+\d][\d\s\-()]*$/.test(phone.trim()) && digits.length >= 7 && digits.length <= 15;
}

// Turn fetch/network failures into a message a visitor can act on
export function friendlyError(err: unknown, fallback = "Something went wrong. Please try again.") {
  const msg = err instanceof Error ? err.message : "";
  if (!msg || /failed to fetch|networkerror|load failed/i.test(msg)) {
    return "Cannot reach the server right now. Please check your connection or call us at +977-9804853916.";
  }
  return msg || fallback;
}

// POST JSON and throw the server's error message on failure
export async function postJSON<T = unknown>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as any).error || `Request failed (${res.status}).`);
  return data as T;
}
