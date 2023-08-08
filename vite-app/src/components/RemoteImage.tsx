import { useState, ImgHTMLAttributes } from "react";
import clsx from "clsx";

interface RemoteImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackSource: string;
  containerClassName?: string;
  imgClassName?: string;
}

export default function RemoteImage({
  fallbackSource,
  containerClassName = "",
  imgClassName = "",
  alt = "",
  src,
  ...imgProps
}: RemoteImageProps) {
  const [imageSrc, setImageSrc] = useState(src);

  const handleImageError = () => {
    setImageSrc(fallbackSource);
  };

  return (
    <div className={containerClassName}>
      <img
        src={imageSrc}
        alt={alt}
        onError={handleImageError}
        className={clsx("w-full h-full object-cover", imgClassName)}
        {...imgProps}
      />
    </div>
  );
}
