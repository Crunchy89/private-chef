type CmsImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
};

export function CmsImage({
  src,
  alt,
  className,
  priority,
  fill,
}: CmsImageProps) {
  const isDrive = src.includes("drive.google.com");

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      decoding="async"
      // Required for Drive thumbnail hotlinking from localhost / other origins
      referrerPolicy={isDrive ? "no-referrer" : undefined}
      fetchPriority={priority ? "high" : "auto"}
      className={
        fill ? `absolute inset-0 h-full w-full ${className ?? ""}` : className
      }
    />
  );
}
