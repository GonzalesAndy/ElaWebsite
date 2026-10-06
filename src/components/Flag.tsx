import type { Locale } from "@/i18n/config";

/* Inline SVG flags — emoji flags don't render on Windows. */
const flags: Record<Locale, React.ReactNode> = {
  en: (
    <svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice">
      <rect width="60" height="30" fill="#012169" />
      <path d="M0 0l60 30M60 0L0 30" stroke="#fff" strokeWidth="6" />
      <path d="M0 0l60 30M60 0L0 30" stroke="#C8102E" strokeWidth="2.5" />
      <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
      <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  ),
  de: (
    <svg viewBox="0 0 5 3" preserveAspectRatio="xMidYMid slice">
      <rect width="5" height="1" fill="#000" />
      <rect y="1" width="5" height="1" fill="#DD0000" />
      <rect y="2" width="5" height="1" fill="#FFCE00" />
    </svg>
  ),
  sk: (
    <svg viewBox="0 0 9 6" preserveAspectRatio="xMidYMid slice">
      <rect width="9" height="2" fill="#fff" />
      <rect y="2" width="9" height="2" fill="#0B4EA2" />
      <rect y="4" width="9" height="2" fill="#EE1C25" />
      <path d="M2.3 1.2h2.6v2c0 1-.6 1.6-1.3 1.9-.7-.3-1.3-.9-1.3-1.9z" fill="#fff" />
      <path d="M2.5 1.4h2.2v1.8c0 .85-.5 1.35-1.1 1.65-.6-.3-1.1-.8-1.1-1.65z" fill="#EE1C25" />
      <path d="M3.45 1.8h.3v.35h.45v.3h-.45v.3h.6v.3h-.6v.6h-.3v-.6h-.6v-.3h.6v-.3h-.45v-.3h.45z" fill="#fff" />
      <path d="M2.55 3.9c.25-.35.5-.45.75-.35.1-.2.4-.3.6-.05.25-.15.6-.05.7.3-.3.45-.65.75-1 .95-.45-.2-.85-.45-1.05-.85z" fill="#0B4EA2" />
    </svg>
  ),
  it: (
    <svg viewBox="0 0 3 2" preserveAspectRatio="xMidYMid slice">
      <rect width="1" height="2" fill="#009246" />
      <rect x="1" width="1" height="2" fill="#fff" />
      <rect x="2" width="1" height="2" fill="#CE2B37" />
    </svg>
  ),
};

export default function Flag({ locale }: { locale: Locale }) {
  return (
    <span className="flag" aria-hidden="true">
      {flags[locale]}
    </span>
  );
}
