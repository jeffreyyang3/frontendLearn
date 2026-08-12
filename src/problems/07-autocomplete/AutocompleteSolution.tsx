import { useState, useEffect } from "react";
import { fetchSuggestions } from "./autocompleteApi";
import type { Suggestion } from "./autocompleteApi";

export default function AutocompleteSolution() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<Suggestion[]>([]);
  const [loading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim().length) return;
    setIsLoading(true);
    const abortController = new AbortController();

    const timeout = setTimeout(async () => {
      console.log("timeout");

      try {
        const suggestions = await fetchSuggestions(
          searchQuery,
          abortController.signal,
        );
        setSearchSuggestions(suggestions);
        setIsLoading(false);
      } catch {
        if (abortController.signal.aborted) {
          console.log("aborted");
        }
      }
    }, 300);

    return () => {
      abortController.abort();
      clearTimeout(timeout);
    };
  }, [searchQuery]);

  return (
    <div>
      <input type="text" onChange={(e) => setSearchQuery(e.target.value)} />{" "}
      <br />
      {loading ? (
        <div>loading</div>
      ) : (
        <ul>
          {searchSuggestions.map(({ id, label }) => {
            return <li key={id}>{label}</li>;
          })}
        </ul>
      )}
    </div>
  );
}
