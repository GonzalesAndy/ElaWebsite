import { Fragment } from "react";

/** Renders text where *words* become an italic accent and "\n" becomes a line break. */
export default function Rich({ text }: { text: string }) {
  return text.split("\n").map((line, l) => (
    <Fragment key={l}>
      {l > 0 && <br />}
      {line.split(/(\*[^*]+\*)/g).map((part, i) =>
        part.startsWith("*") && part.endsWith("*") ? <em key={i}>{part.slice(1, -1)}</em> : part,
      )}
    </Fragment>
  ));
}
