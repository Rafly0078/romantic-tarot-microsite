"use client";

import { ImgHTMLAttributes, useState } from "react";

type AssetImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  fallbackClassName?: string;
};

export function AssetImage({
  src,
  alt,
  className,
  fallbackClassName,
  ...props
}: AssetImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        aria-hidden="true"
        className={
          fallbackClassName ??
          "block rounded-full border border-gold/40 bg-blush/30 shadow-glow"
        }
      />
    );
  }

  return (
    <img
      src={src.includes("?") ? src : `${src}?v=3`}
      alt={alt}
      className={className}
      loading={props.loading ?? "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
      {...props}
    />
  );
}
