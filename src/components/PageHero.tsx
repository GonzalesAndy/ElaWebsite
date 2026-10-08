import Rich from "./Rich";

type Props = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  intro?: string;
  /** Optional visual on the right (portrait, photo). */
  aside?: React.ReactNode;
  /** Title and intro use the full width, each on one line on desktop. */
  wide?: boolean;
};

/** The opening of an inner page: eyebrow, large title, intro, and an optional visual. */
export default function PageHero({ eyebrow, title, subtitle, intro, aside, wide }: Props) {
  return (
    <section
      className={`page-hero ${aside ? "page-hero--split" : ""} ${wide ? "page-hero--wide" : ""}`}
      aria-labelledby="page-title"
    >
      <div className="container page-hero-grid">
        <div className="page-hero-text">
          <p className="eyebrow rise" style={{ "--i": 0 } as React.CSSProperties}>
            {eyebrow}
          </p>
          <h1 id="page-title" className="page-title rise" style={{ "--i": 1 } as React.CSSProperties}>
            <Rich text={title} />
          </h1>
          {subtitle && (
            <p className="page-subtitle rise" style={{ "--i": 2 } as React.CSSProperties}>
              {subtitle}
            </p>
          )}
          {intro && (
            <p className="lead page-intro rise" style={{ "--i": 3 } as React.CSSProperties}>
              {intro}
            </p>
          )}
        </div>
        {aside && (
          <div className="page-hero-aside rise" style={{ "--i": 2 } as React.CSSProperties}>
            {aside}
          </div>
        )}
      </div>
    </section>
  );
}
