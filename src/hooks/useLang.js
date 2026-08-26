import { useParams } from "react-router-dom";

export function useLang() {
  return useParams().lang || "fr";
}
