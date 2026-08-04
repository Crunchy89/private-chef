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
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      className={
        fill ? `absolute inset-0 h-full w-full ${className ?? ""}` : className
      }
    />
  );
}
