import { forwardRef } from "react";
import Image from "next/image";
import clsx from "clsx";

interface LogoProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}

const Logo = forwardRef<HTMLImageElement, LogoProps>(
  ({ src, alt = "Logo", width = 100, height = 100, className }, ref) => {
    return (
      <Image
        ref={ref}
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={clsx("object-contain", className)}
        unoptimized // Needed for SVGs to load properly in Next.js
      />
    );
  }
);

Logo.displayName = "Logo";

export default Logo;