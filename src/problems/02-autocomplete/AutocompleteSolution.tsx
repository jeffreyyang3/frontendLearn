import { useState, useEffect } from "react";
import { fetchSuggestions } from "./autocompleteApi";
import type { Suggestion } from "./autocompleteApi";

interface QueryChangeInfo {
  timeout: ReturnType<typeof setTimeout>;
  abortController: AbortController;
}

export default function AutocompleteSolution() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<Suggestion[]>([]);
  const [loading, setIsLoading] = useState(false);
  const [queryChangeInfo, setQueryChangeInfo] =
    useState<QueryChangeInfo | null>(null);

  useEffect(() => {
    if (searchQuery.trim().length) {
      handleQueryChange(searchQuery);
    }
  }, [searchQuery]);

  const handleQueryChange = (val: string) => {
    setIsLoading(true);
    if (queryChangeInfo !== null) {
      const { timeout, abortController } = queryChangeInfo;
      clearTimeout(timeout);
      abortController.abort();
    }
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
      } catch (e) {
        if (abortController.signal.aborted) {
          console.log("aborted");
        }
      }
    }, 300);
    setQueryChangeInfo({
      timeout,
      abortController,
    });
  };

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
