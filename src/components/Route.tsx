/** The pilgrimage route as a line of stops: horizontal on wide screens, vertical on phones. */
export default function Route({ stops, label }: { stops: string[]; label: string }) {
  return (
    <ol className="route" data-reveal aria-label={label}>
      {stops.map((stop, i) => (
        <li key={stop} className="route-stop" style={{ "--i": i } as React.CSSProperties}>
          <span className="route-marker" aria-hidden="true" />
          <span className="route-name">{stop}</span>
        </li>
      ))}
    </ol>
  );
}
