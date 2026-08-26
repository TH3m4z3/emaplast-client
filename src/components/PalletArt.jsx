export default function PalletArt({ sku = "EP", nestable }) {
  const tone = nestable ? "#2f8f64" : sku.includes("SR") ? "#c45c26" : "#1f6b4a";
  return (
    <svg viewBox="0 0 260 140" width="100%" height="140" aria-hidden="true">
      <rect x="18" y="28" width="224" height="54" rx="8" fill={tone} />
      <rect x="28" y="36" width="204" height="8" rx="2" fill="#f3ead7" opacity="0.35" />
      <rect x="28" y="50" width="204" height="8" rx="2" fill="#f3ead7" opacity="0.25" />
      <rect x="28" y="64" width="204" height="8" rx="2" fill="#f3ead7" opacity="0.18" />
      {[36, 118, 200].map((x) => (
        <rect key={x} x={x} y="82" width="28" height="28" rx="4" fill="#12241f" />
      ))}
      <text x="130" y="22" textAnchor="middle" fill="#12241f" fontSize="13" fontFamily="IBM Plex Sans">
        {sku}
      </text>
    </svg>
  );
}
