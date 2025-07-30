"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

type ImageWithFallbackProps = ImageProps & {
  fallbackSrc?: string;
};

export default function ImageWithFallback({
  src,
  fallbackSrc = "/images/default-doctor.png",
  alt,
  ...rest
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <Image
      {...rest}
      src={imgSrc || fallbackSrc}
      alt={alt}
      onError={handleError}
    />
  );
}
