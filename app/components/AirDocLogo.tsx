import React from "react";
import clsx from "clsx";

export interface AirDocLogoProps {
  variant?: "full" | "mark" | "wordmark";
  size?: "sm" | "md" | "lg" | number;
  theme?: "color" | "white" | "monochrome";
  className?: string;
  iconOnlyOnMobile?: boolean;
}

export function AirDocLogo({
  variant = "full",
  size = "md",
  theme = "color",
  className,
  iconOnlyOnMobile = false,
}: AirDocLogoProps) {
  // Dimension calculations
  const markSize =
    typeof size === "number"
      ? size
      : size === "sm"
      ? 26
      : size === "lg"
      ? 38
      : 32;

  const isWhite = theme === "white";
  const isMonochrome = theme === "monochrome";

  // Palette definitions
  const primaryBlue = isWhite ? "#FFFFFF" : isMonochrome ? "currentColor" : "#1D4ED8";
  const deepBlue = isWhite ? "#F1F5F9" : isMonochrome ? "currentColor" : "#1E40AF";
  const lightCyan = isWhite ? "#BAE6FD" : isMonochrome ? "currentColor" : "#38BDF8";
  const darkCyan = isWhite ? "#7DD3FC" : isMonochrome ? "currentColor" : "#0284C7";

  // Unique ID prefix to prevent SVG gradient ID collisions when multiple logos appear on the same page
  const id = React.useId().replace(/:/g, "_");

  const renderMark = () => (
    <svg
      width={markSize}
      height={markSize}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-200 group-hover:scale-105"
      aria-hidden={variant === "full"}
      role={variant === "mark" ? "img" : undefined}
      aria-label={variant === "mark" ? "AirDoc" : undefined}
    >
      <defs>
        <linearGradient id={`${id}_prim`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryBlue} />
          <stop offset="100%" stopColor={deepBlue} />
        </linearGradient>
        <linearGradient id={`${id}_wing`} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={darkCyan} />
          <stop offset="50%" stopColor={lightCyan} />
          <stop offset="100%" stopColor="#E0F2FE" />
        </linearGradient>
        <filter id={`${id}_shadow`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#0F172A" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Clinical Medical Cross Structure */}
      <rect x="19" y="5" width="10" height="38" rx="5" fill={`url(#${id}_prim)`} />
      <rect x="5" y="19" width="38" height="10" rx="5" fill={`url(#${id}_prim)`} />

      {/* Aerodynamic Forward-Lift Wing */}
      <path
        d="M 5 33 C 12 32, 19 28, 24 24 C 29 20, 36 13, 44 9 C 39 16, 32 23, 27 27 C 21 32, 13 36, 5 33 Z"
        fill={`url(#${id}_wing)`}
        filter={`url(#${id}_shadow)`}
      />

      {/* Secondary Airfoil Highlight Accent */}
      <path
        d="M 12 11 C 17 14, 21 17, 24 19 C 20 18, 16 16, 12 11 Z"
        fill={lightCyan}
        opacity="0.8"
      />

      {/* Central Clinical Pulse Node */}
      <circle cx="24" cy="24" r="2.8" fill={isWhite ? "#1E40AF" : "#FFFFFF"} />
      <circle cx="24" cy="24" r="1.5" fill={darkCyan} />
    </svg>
  );

  const textClasses = clsx(
    "font-semibold tracking-tight transition-colors",
    size === "sm" && "text-lg",
    size === "md" && "text-xl",
    size === "lg" && "text-2xl",
    typeof size === "number" && "text-xl",
    iconOnlyOnMobile && "hidden sm:inline-block"
  );

  if (variant === "mark") {
    return (
      <span className={clsx("inline-flex items-center justify-center", className)}>
        {renderMark()}
      </span>
    );
  }

  if (variant === "wordmark") {
    return (
      <span className={clsx("inline-flex items-center", textClasses, className)}>
        <span className={isWhite ? "text-white" : "text-slate-900"}>Air</span>
        <span className={isWhite ? "text-sky-300" : "text-blue-700"}>Doc</span>
      </span>
    );
  }

  return (
    <span
      className={clsx(
        "group inline-flex items-center select-none gap-2.5",
        className
      )}
      role="img"
      aria-label="AirDoc"
    >
      {renderMark()}
      <span className={textClasses}>
        <span className={isWhite ? "text-white" : "text-slate-900"}>Air</span>
        <span className={isWhite ? "text-sky-300" : "text-blue-700 font-bold"}>Doc</span>
      </span>
    </span>
  );
}
