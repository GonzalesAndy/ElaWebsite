/** Monogram (traced from Elena's logo) + wordmark. The mark takes its colour from currentColor. */
export default function Logo({ className }: { className?: string }) {
  return (
    <span className={`logo ${className ?? ""}`}>
      <span className="logo-mark" aria-hidden="true" />
      <span className="logo-word">Aurea</span>
    </span>
  );
}
