import type { SVGProps } from "react";

export type IconName =
  | "logo"
  | "alert"
  | "map"
  | "chart"
  | "user"
  | "settings"
  | "search"
  | "bell"
  | "check"
  | "x"
  | "chevron"
  | "plus"
  | "logout"
  | "shield"
  | "database"
  | "ranking"
  | "wind"
  | "thermometer"
  | "droplet"
  | "volume"
  | "file"
  | "clock"
  | "edit"
  | "trash"
  | "archive";

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  size?: number;
  color?: string;
}

const PATHS: Record<IconName, React.ReactNode> = {
  logo: (
    <>
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 12l3 3 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  alert: (
    <>
      <path d="M12 2L2 20h20L12 2z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="16" r="0.5" fill="currentColor" />
    </>
  ),
  map: (
    <>
      <circle cx="12" cy="10" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 2C7.6 2 4 5.4 4 9.5 4 15.5 12 22 12 22s8-6.5 8-12.5C20 5.4 16.4 2 12 2z" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </>
  ),
  chart: (
    <path d="M3 20h18M5 20V10M9 20V4M13 20v-8M17 20V8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 1v4M12 19v4M4.2 4.2l2.8 2.8M17 17l2.8 2.8M1 12h4M19 12h4M4.2 19.8l2.8-2.8M17 7l2.8-2.8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  search: (
    <>
      <circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <line x1="15" y1="15" x2="21" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </>
  ),
  check: (
    <path d="M5 12l5 5L20 7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  x: (
    <>
      <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  chevron: (
    <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  plus: (
    <>
      <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  logout: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <polyline points="16,17 21,12 16,7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  shield: (
    <path d="M12 2l8 4v6c0 5.5-3.8 8.2-8 10-4.2-1.8-8-4.5-8-10V6l8-4z" fill="none" stroke="currentColor" strokeWidth="1.5" />
  ),
  database: (
    <>
      <ellipse cx="12" cy="5" rx="8" ry="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </>
  ),
  ranking: (
    <path d="M6 9H2v12h4V9zM14 4h-4v17h4V4zM22 14h-4v7h4v-7z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  ),
  wind: (
    <path d="M9.6 4.5A2.5 2.5 0 1 1 12 7H2M12.9 17.5A2.5 2.5 0 1 0 15.4 15H2M17.4 8.5A2.5 2.5 0 1 1 19.9 11H2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  ),
  thermometer: (
    <path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z" fill="none" stroke="currentColor" strokeWidth="1.5" />
  ),
  droplet: (
    <path d="M12 2.7c-5 5.3-7 8-7 11.3a7 7 0 0 0 14 0c0-3.3-2-6-7-11.3z" fill="none" stroke="currentColor" strokeWidth="1.5" />
  ),
  volume: (
    <>
      <path d="M11 5L6 9H2v6h4l5 4V5z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M19.1 4.9a10 10 0 0 1 0 14.2M15.5 8.5a5 5 0 0 1 0 7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  file: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <polyline points="14,2 14,8 20,8" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <polyline points="12,6 12,12 16,14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
  edit: (
    <>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </>
  ),
  trash: (
    <>
      <polyline points="3,6 5,6 21,6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </>
  ),
  archive: (
    <>
      <path d="M21 8v13H3V8M1 3h22v5H1z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="10" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  ),
};

export function Icon({
  name,
  size = 16,
  color,
  className,
  style,
  ...rest
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={{ flexShrink: 0, color, ...style }}
      aria-hidden="true"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
