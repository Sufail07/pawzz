import { useEffect, useState } from "react";

interface DeviceFrameProps {
  src: string;
  label: string;
  width?: string;
  height?: string;
  fallback?: string;
}

export function DeviceFrame({
  src,
  label,
  width = "390px",
  height = "844px",
  fallback,
}: DeviceFrameProps) {
  const [loadFailed, setLoadFailed] = useState(false);
  const [showingFallback, setShowingFallback] = useState(false);

  // Timed fallback: if iframe doesn't load within 4s, show screenshot
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loadFailed && !showingFallback) {
        setShowingFallback(true);
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [loadFailed, showingFallback]);

  return (
    <figure className="relative rounded-[20px] border border-line bg-surface overflow-hidden shadow-lg">
      {!showingFallback ? (
        <iframe
          src={src}
          title={label}
          width={width}
          height={height}
          loading="lazy"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setShowingFallback(false)}
          onError={() => {
            setLoadFailed(true);
            setShowingFallback(true);
          }}
          className="w-full h-full block"
        />
      ) : (
        <img
          src={fallback || src}
          alt={`${label} (screenshot fallback)`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      )}
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-2 right-2 z-10 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-ink text-surface text-xs font-semibold hover:bg-ink/90 transition-colors"
      >
        Open full site
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      </a>
    </figure>
  );
}
