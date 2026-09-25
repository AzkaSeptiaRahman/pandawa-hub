"use client";

const DEFAULT_IMAGES = ["/oo.jpg"];

type PhotoMarqueeProps = {
  /** Image URLs to loop. Falls back to the bundled placeholder. */
  images?: string[];
  /** Number of vertical strips. */
  columns?: number;
  /** Base loop duration in seconds; each column is offset slightly. */
  duration?: number;
  /** Tiles rendered per half per column (keep high enough to fill the viewport). */
  repeats?: number;
  className?: string;
};

/**
 * Decorative full-bleed background of looping photo strips.
 * Columns alternate direction (up / down / up ...) and move seamlessly
 * because every track holds two identical halves and animates to -50%.
 */
export default function PhotoMarquee({
  images,
  columns = 6,
  duration = 46,
  repeats = 8,
  className = "",
}: PhotoMarqueeProps) {
  const list = images && images.length > 0 ? images : DEFAULT_IMAGES;

  // Each half of a track: repeat the base list until it has `repeats` tiles.
  const tiles = Array.from(
    { length: Math.max(repeats, list.length) },
    (_, i) => list[i % list.length],
  );

  const columnList = Array.from({ length: columns }, (_, i) => {
    // Rotate so neighbouring columns don't line up identically.
    const offset = i % list.length;
    const half = [...tiles.slice(offset), ...tiles.slice(0, offset)];
    return { half, index: i };
  });

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 flex">
        {columnList.map(({ half, index }) => {
          const up = index % 2 === 0;

          // Thin the strips out on small screens.
          const responsive =
            index >= 5
              ? "hidden md:block"
              : index >= 4
                ? "hidden sm:block"
                : "block";

          return (
            <div
              key={index}
              className={`min-w-0 flex-1 overflow-hidden ${responsive}`}
            >
              <div
                className={`flex w-full flex-col will-change-transform ${
                  up ? "animate-marquee-up" : "animate-marquee-down"
                }`}
                style={
                  {
                    "--marquee-duration": `${duration + index * 3}s`,
                  } as React.CSSProperties
                }
              >
                {[...half, ...half].map((src, i) => (
                  <div key={i} className="w-full shrink-0 p-1 sm:p-1.5">
                    <img
                      src={src}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="aspect-[4/3] w-full rounded-[13px] object-cover opacity-70"
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Readability overlay */}
      <div className="app-photo-overlay absolute inset-0" />
    </div>
  );
}
