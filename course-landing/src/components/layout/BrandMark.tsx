export function BrandMark({ className = "size-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="64" height="64" rx="14" fill="#3B3FD9" />
      <path d="M20 18h8v20h16v8H20z" fill="#FFFFFF" />
      <circle cx="45" cy="22" r="6" fill="#C6F432" />
    </svg>
  );
}
