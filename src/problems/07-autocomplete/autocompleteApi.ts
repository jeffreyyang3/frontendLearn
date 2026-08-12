export type Suggestion = {
  id: string;
  label: string;
};

const WORDS = [
  "apple",
  "apricot",
  "avocado",
  "banana",
  "blackberry",
  "blueberry",
  "cantaloupe",
  "cherry",
  "clementine",
  "coconut",
  "cranberry",
  "date",
  "dragonfruit",
  "elderberry",
  "fig",
  "gooseberry",
  "grape",
  "grapefruit",
  "guava",
  "honeydew",
  "jackfruit",
  "kiwi",
  "kumquat",
  "lemon",
  "lime",
  "lychee",
  "mango",
  "melon",
  "mulberry",
  "nectarine",
  "olive",
  "orange",
  "papaya",
  "passionfruit",
  "peach",
  "pear",
  "persimmon",
  "pineapple",
  "plum",
  "pomegranate",
  "pomelo",
  "quince",
  "raspberry",
  "starfruit",
  "strawberry",
  "tangerine",
  "watermelon",
  "boysenberry",
  "currant",
  "mandarin",
] as const;

const suggestions: Suggestion[] = WORDS.map((word) => ({
  id: word,
  label: word,
}));

function abortError(signal: AbortSignal) {
  return (
    signal.reason ?? new DOMException("The request was aborted", "AbortError")
  );
}

/**
 * A frontend-only mock API. Variable latency intentionally allows requests to
 * finish out of order so consumers still need to handle request races.
 */
export function fetchSuggestions(
  query: string,
  signal: AbortSignal,
): Promise<Suggestion[]> {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(abortError(signal));
      return;
    }

    const delay = 200 + Math.floor(Math.random() * 600);
    const timeoutId = window.setTimeout(() => {
      signal.removeEventListener("abort", handleAbort);

      resolve(
        suggestions.filter(({ label }) =>
          label.toLocaleLowerCase().includes(normalizedQuery),
        ),
      );
    }, delay);

    function handleAbort() {
      window.clearTimeout(timeoutId);
      reject(abortError(signal));
    }

    signal.addEventListener("abort", handleAbort, { once: true });
  });
}
