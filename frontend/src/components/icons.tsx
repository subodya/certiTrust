import React from "react";

type IconProps = { className?: string };

export function ShieldBadgeIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3L19 6V11C19 16 15.5 20.5 12 22C8.5 20.5 5 16 5 11V6L12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M9.2 11.8L11.2 13.8L15 10" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function SearchIcon({ className = "h-4 w-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function CheckRingIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.8 12.2L11 14.3L15.4 9.7" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

