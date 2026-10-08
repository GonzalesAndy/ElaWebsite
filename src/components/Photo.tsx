import Image from "next/image";

type Props = {
  /** Path under /public. Leave empty to show a soft placeholder until the photo is added. */
  src?: string | null;
  sizes: string;
  className?: string;
  priority?: boolean;
  /** Which part of the photo stays in view when it is cropped, e.g. "40% 30%". */
  focus?: string;
};

/** A decorative photo that fills its (positioned) parent, or a warm placeholder when there is no photo yet. */
export default function Photo({ src, sizes, className, priority, focus }: Props) {
  if (!src) return <span className={`photo-placeholder ${className ?? ""}`} aria-hidden="true" />;
  return (
    <Image
      src={src}
      alt=""
      fill
      sizes={sizes}
      className={className}
      priority={priority}
      style={focus ? { objectPosition: focus } : undefined}
    />
  );
}
