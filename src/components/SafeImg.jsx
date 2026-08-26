import { useState } from "react";
import { mediaUrl } from "../utils/image.js";

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 140">
      <rect width="260" height="140" fill="#e8eef4"/>
      <rect x="20" y="36" width="220" height="48" rx="8" fill="#0055a4"/>
      <rect x="36" y="92" width="36" height="22" rx="4" fill="#07244a"/>
      <rect x="112" y="92" width="36" height="22" rx="4" fill="#07244a"/>
      <rect x="188" y="92" width="36" height="22" rx="4" fill="#07244a"/>
    </svg>`
  );

export default function SafeImg({ src, alt = "", className }) {
  const [broken, setBroken] = useState(false);
  const resolved = broken ? PLACEHOLDER : mediaUrl(src, PLACEHOLDER);
  return (
    <img
      className={className}
      src={resolved}
      alt={alt}
      onError={() => setBroken(true)}
    />
  );
}
