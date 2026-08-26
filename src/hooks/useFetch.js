import { useEffect, useState } from "react";
import { http } from "../services/http.js";

export function useFetch(path) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  useEffect(() => {
    let live = true;
    http.get(path).then((d) => live && setData(d)).catch((e) => live && setErr(e.message));
    return () => {
      live = false;
    };
  }, [path]);
  return { data, err };
}
