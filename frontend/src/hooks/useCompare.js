
import { useState, useCallback } from "react";
import { compareProduct } from "../utils/api.js";

export function useCompare() {
  const [results, setResults]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [lastQuery, setLastQuery] = useState("");

  const search = useCallback(async (query) => {
    if (!query?.trim()) return;

    setLoading(true);
    setError(null);
    setLastQuery(query.trim());

    try {
      const data = await compareProduct(query);
      setResults(data);
    } catch (err) {
      setError(err.message || "Search failed. Please try again.");
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResults(null);
    setError(null);
    setLastQuery("");
  }, []);

  return { results, loading, error, lastQuery, search, clear };
}
