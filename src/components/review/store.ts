/**
 * Where review comments live.
 *   NEXT_PUBLIC_REVIEW_ENDPOINT set → the Cloudflare Worker in /review-worker (shared by everyone)
 *   not set (local dev)             → this browser's localStorage only
 */
export type ReviewComment = {
  id: string;
  createdAt: string;
  author: string;
  text: string;
  status: "open" | "resolved";
  /** Language the page was shown in when the comment was written: en, de, sk, it. */
  locale: string;
  /** Page without its locale, e.g. "/" or "/journey/". */
  page: string;
  url: string;
  /** CSS path to the element, used to put the pin back on it. */
  selector: string;
  tag: string;
  /** The element's text (or alt text) at the time, so the comment still makes sense if the text changes. */
  snippet: string;
  /** Text the reviewer had highlighted inside the element, if any. */
  quote?: string;
  /** Image or video file the comment is about. */
  src?: string;
  viewport: { w: number; h: number };
};

export type NewComment = Omit<ReviewComment, "id" | "createdAt" | "status">;

const ENDPOINT = (process.env.NEXT_PUBLIC_REVIEW_ENDPOINT ?? "").replace(/\/$/, "");
const LOCAL_KEY = "review-comments";
export const KEY_STORAGE = "review-key";

export const isShared = Boolean(ENDPOINT);

function reviewKey() {
  try {
    return localStorage.getItem(KEY_STORAGE) ?? "";
  } catch {
    return "";
  }
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${ENDPOINT}${path}`, {
    ...init,
    headers: { "content-type": "application/json", authorization: `Bearer ${reviewKey()}` },
  });
  if (!res.ok) throw new Error(res.status === 401 ? "Review link not valid" : `Server error ${res.status}`);
  return res.json();
}

function readLocal(): ReviewComment[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function writeLocal(comments: ReviewComment[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(comments));
}

export async function listComments(): Promise<ReviewComment[]> {
  return ENDPOINT ? api("/comments") : readLocal();
}

export async function addComment(input: NewComment): Promise<ReviewComment> {
  if (ENDPOINT) return api("/comments", { method: "POST", body: JSON.stringify(input) });
  const comment: ReviewComment = {
    ...input,
    id: crypto.randomUUID().slice(0, 8),
    createdAt: new Date().toISOString(),
    status: "open",
  };
  writeLocal([...readLocal(), comment]);
  return comment;
}

export async function setStatus(id: string, status: ReviewComment["status"]): Promise<void> {
  if (ENDPOINT) {
    await api(`/comments/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
    return;
  }
  writeLocal(readLocal().map((c) => (c.id === id ? { ...c, status } : c)));
}

export async function deleteComment(id: string): Promise<void> {
  if (ENDPOINT) {
    await api(`/comments/${id}`, { method: "DELETE" });
    return;
  }
  writeLocal(readLocal().filter((c) => c.id !== id));
}
