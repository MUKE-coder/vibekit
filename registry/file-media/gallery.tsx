"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Download, X, ZoomIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Image gallery with built-in lightbox. Renders a responsive grid;
 * clicking a tile opens a fullscreen viewer with keyboard navigation
 * (←/→ to step, Esc to close), optional download, and tap-to-close.
 *
 *   <Gallery
 *     images={[
 *       { src: "/hero.jpg", alt: "Hero", caption: "Welcome" },
 *       { src: "/sub.jpg", alt: "Sub" },
 *     ]}
 *     columns={{ base: 2, md: 3, lg: 4 }}
 *     enableDownload
 *   />
 *
 * If your images are remote and not in `next.config.js` domains, pass
 * `unoptimized` so Next/Image renders without optimization.
 */

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: React.ReactNode;
  /** Optional explicit width / height for next/image hints. */
  width?: number;
  height?: number;
}

interface GalleryProps {
  images: GalleryImage[];
  /** Tailwind-style column breakpoints. Default: { base: 2, sm: 3, lg: 4 }. */
  columns?: { base?: number; sm?: number; md?: number; lg?: number; xl?: number };
  /** Show a Download button in the lightbox. Default: false. */
  enableDownload?: boolean;
  /** Pass through to next/image if your sources need it. */
  unoptimized?: boolean;
  className?: string;
}

const colsMap: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

const smMap: Record<number, string> = { 1: "sm:grid-cols-1", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-4", 5: "sm:grid-cols-5", 6: "sm:grid-cols-6" };
const mdMap: Record<number, string> = { 1: "md:grid-cols-1", 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-4", 5: "md:grid-cols-5", 6: "md:grid-cols-6" };
const lgMap: Record<number, string> = { 1: "lg:grid-cols-1", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-5", 6: "lg:grid-cols-6" };
const xlMap: Record<number, string> = { 1: "xl:grid-cols-1", 2: "xl:grid-cols-2", 3: "xl:grid-cols-3", 4: "xl:grid-cols-4", 5: "xl:grid-cols-5", 6: "xl:grid-cols-6" };

export function Gallery({
  images,
  columns = { base: 2, sm: 3, lg: 4 },
  enableDownload = false,
  unoptimized,
  className,
}: GalleryProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const open = (index: number) => setActiveIndex(index);
  const close = React.useCallback(() => setActiveIndex(null), []);
  const next = React.useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length],
  );
  const prev = React.useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length],
  );

  React.useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [activeIndex, close, next, prev]);

  if (images.length === 0) {
    return (
      <div className={cn("rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground", className)}>
        No images.
      </div>
    );
  }

  const gridClass = cn(
    "grid gap-2",
    colsMap[columns.base ?? 2],
    columns.sm ? smMap[columns.sm] : null,
    columns.md ? mdMap[columns.md] : null,
    columns.lg ? lgMap[columns.lg] : null,
    columns.xl ? xlMap[columns.xl] : null,
  );

  return (
    <>
      <ul className={cn(gridClass, className)}>
        {images.map((image, index) => (
          <li key={`${image.src}-${index}`}>
            <button
              type="button"
              onClick={() => open(index)}
              className="group relative block aspect-square w-full overflow-hidden rounded-md border border-border bg-muted"
              aria-label={`Open ${image.alt}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                unoptimized={unoptimized}
                className="object-cover transition group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 grid place-items-center bg-black/0 opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100">
                <ZoomIn className="h-5 w-5 text-white" aria-hidden />
              </div>
            </button>
          </li>
        ))}
      </ul>

      {activeIndex !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${images[activeIndex].alt} (image ${activeIndex + 1} of ${images.length})`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={close}
        >
          {/* Toolbar */}
          <div className="absolute right-2 top-2 z-10 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            {enableDownload ? (
              <Button
                size="icon"
                variant="ghost"
                asChild
                className="h-9 w-9 text-white hover:bg-white/10 hover:text-white"
              >
                <a href={images[activeIndex].src} download aria-label="Download image">
                  <Download className="h-4 w-4" aria-hidden />
                </a>
              </Button>
            ) : null}
            <Button
              size="icon"
              variant="ghost"
              onClick={close}
              className="h-9 w-9 text-white hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" aria-hidden />
            </Button>
          </div>

          {/* Prev */}
          {images.length > 1 ? (
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-2 z-10 h-10 w-10 text-white hover:bg-white/10 hover:text-white sm:left-4"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </Button>
          ) : null}

          {/* Image */}
          <div
            className="relative max-h-[85vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[activeIndex].src}
              alt={images[activeIndex].alt}
              width={images[activeIndex].width ?? 1600}
              height={images[activeIndex].height ?? 1200}
              unoptimized={unoptimized}
              className="max-h-[85vh] w-auto max-w-[90vw] rounded-md object-contain"
              priority
            />
            {images[activeIndex].caption ? (
              <div className="mt-3 text-center text-sm text-white/80">{images[activeIndex].caption}</div>
            ) : null}
            <div className="mt-1 text-center text-xs text-white/50">
              {activeIndex + 1} / {images.length}
            </div>
          </div>

          {/* Next */}
          {images.length > 1 ? (
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-2 z-10 h-10 w-10 text-white hover:bg-white/10 hover:text-white sm:right-4"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </Button>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
