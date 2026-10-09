import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aurea",
  robots: { index: false },
};

/** Minimal shell for the root page, which only redirects to a language. */
export default function RootRedirectLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: "#f5eee1" }}>{children}</body>
    </html>
  );
}
