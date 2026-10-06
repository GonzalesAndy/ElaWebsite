/** Renders text where *words* become an italic accent. */
export default function Rich({ text }: { text: string }) {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.startsWith("*") && part.endsWith("*") ? <em key={i}>{part.slice(1, -1)}</em> : part,
  );
}
