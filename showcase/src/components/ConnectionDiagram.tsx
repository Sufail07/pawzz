export function ConnectionDiagram() {
  const textStyle = { fill: "#14152B", fontSize: 14, fontWeight: 700, textAnchor: "middle" as const, fontFamily: '"Plus Jakarta Sans", sans-serif' };
  const mutedStyle = { fill: "#5A5C7A", fontSize: 12, textAnchor: "middle" as const, fontFamily: '"Plus Jakarta Sans", sans-serif' };
  const inkDarkStyle = { fill: "#1D2B2A", fontSize: 14, fontWeight: 700, textAnchor: "middle" as const, fontFamily: '"Plus Jakarta Sans", sans-serif' };

  return (
    <div className="max-w-1200 mx-auto">
      <div className="flex flex-col items-center justify-center gap-8 p-8">
        <svg
          width="100%"
          height="320"
          viewBox="0 0 800 320"
          className="w-full max-w-4xl"
          role="img"
          aria-label="Content feeds both products"
        >
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L9,3 z" fill="#14152B" />
            </marker>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0F6B63" stopOpacity={1} />
              <stop offset="50%" stopColor="#3B3FD9" stopOpacity={1} />
              <stop offset="100%" stopColor="#C6F432" stopOpacity={1} />
            </linearGradient>
          </defs>

          {/* Top layer: Carousel produces posts */}
          <rect x="50" y="40" width="200" height="80" rx="12" fill="#FBF8F1" stroke="#E6E1D3" strokeWidth="2" />
          <text x="150" y="85" style={textStyle}>Carousel content system</text>
          <text x="150" y="105" style={mutedStyle}>Produces posts for Instagram & LinkedIn</text>

          {/* Arrows down to middle */}
          <line x1="150" y1="120" x2="150" y2="160" stroke="#14152B" strokeWidth="2" markerEnd="url(#arrow)" />
          <line x1="200" y1="120" x2="400" y2="160" stroke="#14152B" strokeWidth="2" markerEnd="url(#arrow)" />
          <line x1="100" y1="120" x2="650" y2="160" stroke="#14152B" strokeWidth="2" markerEnd="url(#arrow)" />

          {/* Middle layer: two audiences */}
          <rect x="50" y="170" width="260" height="80" rx="12" fill="#FBF6EC" stroke="#E4DDCC" strokeWidth="2" />
          <text x="180" y="215" style={inkDarkStyle}>Pet owners</text>
          <text x="180" y="235" style={mutedStyle}>→ Discovery platform</text>

          <rect x="490" y="170" width="260" height="80" rx="12" fill="#F6F6FF" stroke="#E1E1F2" strokeWidth="2" />
          <text x="620" y="215" style={textStyle}>Students & professionals</text>
          <text x="620" y="235" style={mutedStyle}>→ Course page</text>

          {/* Bottom bar: one design system */}
          <rect x="50" y="270" width="700" height="32" rx="8" fill="url(#grad)" />
          <text x="400" y="292" style={{ ...textStyle, fontSize: 13 }}>One design system, one tool stack — connects under all three</text>
        </svg>
      </div>
      <p className="mt-6 text-center text-muted text-sm">
        Content feeds both products, and the same tokens and tools sit under all three.
      </p>
    </div>
  );
}
