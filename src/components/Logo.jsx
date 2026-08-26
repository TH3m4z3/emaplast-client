export default function Logo({ className = "", compact = false }) {
  return (
    <img
      className={`brand-logo ${compact ? "is-compact" : ""} ${className}`}
      src="/brand/no-bg-logo2.png"
      alt="EMAPLAST — Le fabricant de palettes en plastique"
    />
  );
}
