# React Interview Coding Problems

These 10 problems are designed to stand alone as complete React interview
questions. Each is scoped for roughly 35–50 minutes, followed by discussion.
Use function components, hooks, and TypeScript unless the interviewer says
otherwise.

The goal is not merely to produce working UI. Explain your state model,
component boundaries, accessibility choices, edge cases, and tradeoffs while
you work.

---

## 1. Searchable and Filterable Todo List

Build a todo list that lets a user add, complete, search, filter, and delete
tasks.

Start with this type:

```ts
type Todo = {
  id: string;
  title: string;
  completed: boolean;
};
```

### Requirements

- Display the initial todos supplied as a prop.
- Add a todo using a controlled text input and form.
- Ignore submissions that are empty after trimming whitespace.
- Toggle a todo between active and completed.
- Delete a todo.
- Filter by **All**, **Active**, or **Completed**.
- Search titles case-insensitively.
- Display the number of active todos.
- Show a useful empty state when no todos match.
- Use stable keys and semantic form controls.

The filter, search query, and todo list may all remain in memory. Do not use a
backend or global state library.

### Follow-up discussion

- Which values are source state, and which are derived during render?
- Why should the filtered list not normally be stored separately?
- What can go wrong if the array index is used as a key?
- How would the design change if several routes needed to edit the same todos?

---

## 2. Debounced Autocomplete

Build an accessible search box that requests suggestions after the user pauses
typing.

Use the provided mock API:

```ts
import {
  searchSuggestions,
  type Suggestion,
} from './autocompleteApi';
```

The frontend-only mock searches a pool of 50 words and simulates variable
network latency.

### Requirements

- Wait 300 milliseconds after the latest keystroke before making a request.
- Do not request results for an empty or whitespace-only query.
- Show loading, error, empty, and success states.
- Ensure an older, slower response cannot replace newer results.
- Let the user move through results with the up and down arrow keys.
- Select the highlighted result with Enter.
- Close the result list with Escape.
- Allow mouse selection without breaking keyboard behavior.
- Give the input and result list appropriate combobox semantics.

You may implement the debounce yourself. Do not install an autocomplete
component library.

### Follow-up discussion

- Where should timer and request cleanup occur?
- How do stale closures and request races differ?
- Would you cache previous queries? If so, where and for how long?
- How would you test the debounce without making the test suite slow?

---

## 3. Accessible Modal Dialog

Build a reusable modal dialog that can contain arbitrary React children.

Target usage:

```tsx
<Dialog
  open={isOpen}
  title="Delete project?"
  onClose={() => setIsOpen(false)}
>
  <p>This action cannot be undone.</p>
  <button type="button">Delete</button>
</Dialog>
```

### Requirements

- Render nothing when `open` is false.
- Render the dialog through a portal attached to `document.body`.
- Close when the user presses Escape.
- Close when the backdrop itself is clicked, but not when dialog content is
  clicked.
- Move focus into the dialog when it opens.
- Keep Tab and Shift+Tab focus inside the dialog.
- Restore focus to the previously focused element when it closes.
- Apply appropriate dialog labeling and modal semantics.
- Prevent accidental cleanup or listener leaks across repeated openings.

Do not use a dialog or focus-management library.

### Follow-up discussion

- Why does a portal not break React event propagation?
- What is the difference between `preventDefault` and `stopPropagation` here?
- When would the native `<dialog>` element be preferable?
- What additional work is needed to prevent interaction with background
  content?

---

## 4. Sortable and Paginated Data Table

Build a reusable table for displaying, sorting, and paginating user records.

Use this data shape:

```ts
type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  lastActiveAt: string;
};
```

### Requirements

- Accept the complete user array as a prop.
- Display columns for name, email, role, and last active date.
- Sort ascending or descending by clicking a sortable column header.
- Clearly indicate the active sort direction visually and semantically.
- Show 10 rows per page.
- Include Previous and Next controls with correct disabled states.
- Reset to the first page when sorting changes.
- Keep the original prop array unchanged.
- Show the current range, such as “21–30 of 47”.
- Handle an empty array without errors.

Do not install a table library.

### Follow-up discussion

- Which calculations would you derive during render?
- When would `useMemo` help, and when would it only add complexity?
- How would the design change for server-side sorting and pagination?
- How would you virtualize tens of thousands of client-side rows?

---

## 5. Shopping Cart with a Reducer

Build a shopping cart whose related state transitions are managed by a reducer.

Use these types:

```ts
type Product = {
  id: string;
  name: string;
  priceInCents: number;
};

type CartItem = {
  product: Product;
  quantity: number;
};
```

### Requirements

- Display a supplied product catalog.
- Add a product to the cart.
- Adding an existing product increments its quantity.
- Increment or decrement an item's quantity.
- Remove an item when its quantity reaches zero.
- Remove an item directly.
- Clear the entire cart.
- Display total item count and total price.
- Implement cart transitions with `useReducer`.
- Never mutate the previous state.

Format currency for display, but keep all calculations in integer cents.

### Follow-up discussion

- What invariants should the reducer preserve?
- Why are totals better derived than stored?
- What tests would you write directly against the reducer?
- When would moving this reducer into Redux Toolkit be justified?

---

## 6. Multi-Step Registration Form

Build a three-step registration form:

1. Account: email and password
2. Profile: display name and role
3. Review and submit

Use this submission contract:

```ts
type Registration = {
  email: string;
  password: string;
  displayName: string;
  role: "developer" | "designer" | "manager";
};

declare function register(
  values: Registration,
): Promise<{ userId: string }>;
```

### Requirements

- Preserve entered values while moving between steps.
- Prevent advancing until the current step is valid.
- Validate email format, a minimum eight-character password, and a non-empty
  display name.
- Show validation messages associated with their fields.
- Allow the user to return to an earlier step and edit values.
- Disable duplicate submissions while a request is pending.
- Show a submission error without discarding entered values.
- Show a success state after submission.
- Pressing Enter should behave sensibly for the current step.

Do not install a form library.

### Follow-up discussion

- Would you use one state object, several state variables, or a reducer?
- When should validation run?
- How would asynchronous email-availability validation change the design?
- How would you warn users before navigating away with unsaved changes?

---

## 7. Reusable Data-Fetching Hook

Implement a reusable `useFetchJson` hook and a component that demonstrates it.

Target API:

```ts
type FetchState<T> =
  | { status: "idle"; data: null; error: null }
  | { status: "loading"; data: null; error: null }
  | { status: "success"; data: T; error: null }
  | { status: "error"; data: null; error: Error };

function useFetchJson<T>(
  url: string | null,
): FetchState<T> & { refetch: () => void };
```

### Requirements

- Do not request anything when `url` is `null`.
- Request data when a non-null URL changes.
- Expose idle, loading, success, and error states.
- Provide a `refetch` function.
- Abort an obsolete request when the URL changes.
- Abort the active request when the consuming component unmounts.
- Ensure an aborted request is not shown as a user-facing error.
- Do not update state from an outdated request.
- Demonstrate the hook by loading and rendering a list of users.

Use the browser `fetch` API. Do not install a request library.

### Follow-up discussion

- Why is fetching usually an effect while transforming fetched data is not?
- What should be included in the effect dependency array?
- What limitations would this hook have compared with a server-state library?
- How would caching, deduplication, retries, or SSR affect the design?

---

## 8. Toast Notification System

Build a toast system that any descendant component can use without passing
callbacks through every intermediate component.

Target usage:

```tsx
function SaveButton() {
  const { addToast } = useToasts();

  return (
    <button onClick={() => addToast("Changes saved", "success")}>
      Save
    </button>
  );
}
```

### Requirements

- Provide a `ToastProvider` and `useToasts` hook.
- Support success, error, and informational toasts.
- Give every toast a stable unique ID.
- Render multiple toasts in the order they were added.
- Automatically dismiss each toast after five seconds.
- Allow manual dismissal.
- Clean up timers when a toast is dismissed or the provider unmounts.
- Throw a clear error if `useToasts` is called outside its provider.
- Announce important messages appropriately to assistive technology.
- Avoid needless context-driven rerenders where practical.

Use context plus a reducer. Do not install a toast library.

### Follow-up discussion

- Why is context appropriate for this API?
- Which context values may need stable identities?
- Where should timers be owned?
- How would you add pause-on-hover or exit animations?

---

## 9. Infinite-Scrolling Activity Feed

Build an activity feed that loads the next page as the user nears the bottom.

Use this API contract:

```ts
type Activity = {
  id: string;
  actor: string;
  message: string;
  createdAt: string;
};

type ActivityPage = {
  items: Activity[];
  nextCursor: string | null;
};

declare function getActivities(
  cursor: string | null,
  signal: AbortSignal,
): Promise<ActivityPage>;
```

### Requirements

- Load the first page when the feed mounts.
- Load the next page when a sentinel element becomes visible.
- Use `IntersectionObserver` rather than a global scroll listener.
- Do not make duplicate requests for the same cursor.
- Append new pages without discarding existing activities.
- Stop observing for additional pages when `nextCursor` is `null`.
- Show initial-loading, loading-more, empty, and error states.
- Let the user retry a failed page.
- Abort active work when the feed unmounts.
- Use stable keys for feed items.

### Follow-up discussion

- Which values belong in state versus refs?
- How would you handle a backend that returns a duplicate item?
- How would you preserve scroll position across navigation?
- At what point would DOM virtualization become necessary?

---

## 10. Nested File Explorer

Build an interactive file explorer from nested data.

Use this type:

```ts
type FileNode =
  | {
      id: string;
      type: "file";
      name: string;
    }
  | {
      id: string;
      type: "folder";
      name: string;
      children: FileNode[];
    };
```

### Requirements

- Render files and folders at any nesting depth.
- Folders start collapsed.
- Clicking a folder toggles only that folder.
- Display a visible nesting level without encoding it into the data.
- Preserve the open state of other folders when one folder is toggled.
- Allow a file to be selected and visibly indicate the selection.
- Notify the parent through `onSelect(file)` when selection changes.
- Use buttons for interactive folder controls.
- Include `aria-expanded` on folder controls.
- Avoid using array indexes as keys.

Do not mutate the supplied tree and do not add UI state directly to its nodes.

### Follow-up discussion

- Where should expanded-folder state live?
- What are the tradeoffs between recursive components and flattening the tree?
- How would keyboard navigation change the component design?
- How would you efficiently render a very large tree?

---

## 11. Pokémon Stat Viewer

Build a small data explorer that fetches a Pokémon by name or Pokédex number
and turns its response into an easy-to-scan profile.

Starting endpoint:

```ts
const POKEMON_API = "https://pokeapi.co/api/v2/pokemon";

// Example: GET `${POKEMON_API}/pikachu`
```

Model only the response fields the interface uses: `id`, `name`, `height`,
`weight`, `sprites.front_default`, `types`, and `stats`.

### Requirements

- Start by loading Pikachu, then let the user search by Pokémon name or
  Pokédex number.
- Trim and normalize the search value before building the request URL.
- Show distinct loading, error, and success states.
- Treat a not-found response as a useful message rather than a generic
  failure.
- Display the Pokémon name, Pokédex number, sprite, height, weight, and types.
- Visualize each base stat with a labeled horizontal bar whose value is also
  available as text.
- Disable or otherwise guard against an empty search.
- Ensure an older request cannot replace the result of a newer search.
- Keep the last successful profile visible only if that behavior is
  intentional and clearly communicated.

Use the browser `fetch` API and plain HTML/CSS for the visualization. Do not
install a charting or request library.

### Follow-up discussion

- Which values belong in state, and which can be derived from the response
  during render?
- How would you cancel an obsolete request when a user searches again quickly?
- How would you make the stat bars understandable without relying on color or
  width alone?
- What would you cache if users frequently revisit the same Pokémon?

---

# Suggested Interview Evaluation

Across all problems, look for:

- A minimal, non-contradictory state model.
- Correct immutable updates and stable identity.
- Effects used only for synchronization with external systems.
- Correct cleanup of timers, requests, observers, and event listeners.
- Semantic HTML, keyboard support, focus handling, and accessible labeling.
- Explicit loading, error, empty, and boundary states.
- Clear component responsibilities without premature abstraction.
- Tests and explanations focused on observable behavior.
- Awareness of performance without speculative memoization.
- An ability to explain tradeoffs and extend the design when requirements grow.
