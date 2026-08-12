import type { ComponentType } from 'react'
import TodoSolution from './01-todo/TodoSolution'
import FileExplorerSolution from './02-file-explorer/FileExplorerSolution'
import DataTableSolution from './03-data-table/DataTableSolution'
import CartSolution from './04-cart/CartSolution'
import RegistrationSolution from './05-registration/RegistrationSolution'
import FetchHookSolution from './06-fetch-hook/FetchHookSolution'
import AutocompleteSolution from './07-autocomplete/AutocompleteSolution'
import ToastsSolution from './08-toasts/ToastsSolution'
import ActivityFeedSolution from './09-activity-feed/ActivityFeedSolution'
import DialogSolution from './10-dialog/DialogSolution'
import PokeApiSolution from './11-pokeapi/PokeApiSolution'

export type ProblemDefinition = {
  number: number
  slug: string
  title: string
  duration: string
  description: string[]
  steps?: string[]
  codeIntro: string
  code: string
  requirements: string[]
  constraint?: string
  followUps: string[]
  solutionPath: string
  Solution: ComponentType
}

const problemDefinitions: ProblemDefinition[] = [
  {
    number: 1,
    slug: '01-todo',
    title: 'Searchable and Filterable Todo List',
    duration: '35–50 min',
    description: [
      'Build a todo list that lets a user add, complete, search, filter, and delete tasks.',
      'Tests React fundamentals: controlled forms, immutable list updates, stable identity, semantic controls, and deciding which values are source state versus data derived during render.',
    ],
    codeIntro: 'Start with this type:',
    code: `type Todo = {
  id: string;
  title: string;
  completed: boolean;
};`,
    requirements: [
      'Display the initial todos supplied as a prop.',
      'Add a todo using a controlled text input and form.',
      'Ignore submissions that are empty after trimming whitespace.',
      'Toggle a todo between active and completed.',
      'Delete a todo.',
      'Filter by All, Active, or Completed.',
      'Search titles case-insensitively.',
      'Display the number of active todos.',
      'Show a useful empty state when no todos match.',
      'Use stable keys and semantic form controls.',
    ],
    constraint:
      'The filter, search query, and todo list may all remain in memory. Do not use a backend or global state library.',
    followUps: [
      'Which values are source state, and which are derived during render?',
      'Why should the filtered list not normally be stored separately?',
      'What can go wrong if the array index is used as a key?',
      'How would the design change if several routes needed to edit the same todos?',
    ],
    solutionPath: 'src/problems/01-todo/TodoSolution.tsx',
    Solution: TodoSolution,
  },
  {
    number: 7,
    slug: '07-autocomplete',
    title: 'Debounced Autocomplete',
    duration: '35–50 min',
    description: [
      'Build an accessible search box that requests suggestions after the user pauses typing.',
      'Tests effect lifecycle and browser interaction: debounce timer ownership, cleanup, stale closures, request races, cancellation, keyboard navigation, mouse interaction, and ARIA combobox semantics.',
    ],
    codeIntro: 'Use the provided mock API:',
    code: `import {
  searchSuggestions,
  type Suggestion,
} from './autocompleteApi';`,
    requirements: [
      'Wait 300 milliseconds after the latest keystroke before making a request.',
      'Do not request results for an empty or whitespace-only query.',
      'Show loading, error, empty, and success states.',
      'Ensure an older, slower response cannot replace newer results.',
      'Let the user move through results with the up and down arrow keys.',
      'Select the highlighted result with Enter.',
      'Close the result list with Escape.',
      'Allow mouse selection without breaking keyboard behavior.',
      'Give the input and result list appropriate combobox semantics.',
    ],
    constraint:
      'You may implement the debounce yourself. Do not install an autocomplete component library.',
    followUps: [
      'Where should timer and request cleanup occur?',
      'How do stale closures and request races differ?',
      'Would you cache previous queries? If so, where and for how long?',
      'How would you test the debounce without making the test suite slow?',
    ],
    solutionPath:
      'src/problems/07-autocomplete/AutocompleteSolution.tsx',
    Solution: AutocompleteSolution,
  },
  {
    number: 10,
    slug: '10-dialog',
    title: 'Accessible Modal Dialog',
    duration: '35–50 min',
    description: [
      'Build a reusable modal dialog that can contain arbitrary React children.',
      'Tests advanced React and browser behavior: portals, DOM focus management, event propagation, document-level listeners, effect cleanup, keyboard trapping, focus restoration, and modal accessibility semantics.',
    ],
    codeIntro: 'Target usage:',
    code: `<Dialog
  open={isOpen}
  title="Delete project?"
  onClose={() => setIsOpen(false)}
>
  <p>This action cannot be undone.</p>
  <button type="button">Delete</button>
</Dialog>`,
    requirements: [
      'Render nothing when open is false.',
      'Render the dialog through a portal attached to document.body.',
      'Close when the user presses Escape.',
      'Close when the backdrop itself is clicked, but not when dialog content is clicked.',
      'Move focus into the dialog when it opens.',
      'Keep Tab and Shift+Tab focus inside the dialog.',
      'Restore focus to the previously focused element when it closes.',
      'Apply appropriate dialog labeling and modal semantics.',
      'Prevent accidental cleanup or listener leaks across repeated openings.',
    ],
    constraint: 'Do not use a dialog or focus-management library.',
    followUps: [
      'Why does a portal not break React event propagation?',
      'What is the difference between preventDefault and stopPropagation here?',
      'When would the native <dialog> element be preferable?',
      'What additional work is needed to prevent interaction with background content?',
    ],
    solutionPath: 'src/problems/10-dialog/DialogSolution.tsx',
    Solution: DialogSolution,
  },
  {
    number: 3,
    slug: '03-data-table',
    title: 'Sortable and Paginated Data Table',
    duration: '35–50 min',
    description: [
      'Build a reusable table for displaying, sorting, and paginating user records.',
      'Tests React fundamentals: prop immutability, derived sorting and pagination, coordinated state transitions, boundary calculations, semantic tables, and judgment about when memoization is useful.',
    ],
    codeIntro: 'Use this data shape:',
    code: `type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  lastActiveAt: string;
};`,
    requirements: [
      'Accept the complete user array as a prop.',
      'Display columns for name, email, role, and last active date.',
      'Sort ascending or descending by clicking a sortable column header.',
      'Clearly indicate the active sort direction visually and semantically.',
      'Show 10 rows per page.',
      'Include Previous and Next controls with correct disabled states.',
      'Reset to the first page when sorting changes.',
      'Keep the original prop array unchanged.',
      'Show the current range, such as “21–30 of 47”.',
      'Handle an empty array without errors.',
    ],
    constraint: 'Do not install a table library.',
    followUps: [
      'Which calculations would you derive during render?',
      'When would useMemo help, and when would it only add complexity?',
      'How would the design change for server-side sorting and pagination?',
      'How would you virtualize tens of thousands of client-side rows?',
    ],
    solutionPath: 'src/problems/03-data-table/DataTableSolution.tsx',
    Solution: DataTableSolution,
  },
  {
    number: 4,
    slug: '04-cart',
    title: 'Shopping Cart with a Reducer',
    duration: '35–50 min',
    description: [
      'Build a shopping cart whose related state transitions are managed by a reducer.',
      'Tests React fundamentals: reducer and action design, immutable updates, state invariants, derived totals, stable identity, and representing money without floating-point errors.',
    ],
    codeIntro: 'Use these types:',
    code: `type Product = {
  id: string;
  name: string;
  priceInCents: number;
};

type CartItem = {
  product: Product;
  quantity: number;
};`,
    requirements: [
      'Display a supplied product catalog.',
      'Add a product to the cart.',
      'Adding an existing product increments its quantity.',
      "Increment or decrement an item's quantity.",
      'Remove an item when its quantity reaches zero.',
      'Remove an item directly.',
      'Clear the entire cart.',
      'Display total item count and total price.',
      'Implement cart transitions with useReducer.',
      'Never mutate the previous state.',
    ],
    constraint:
      'Format currency for display, but keep all calculations in integer cents.',
    followUps: [
      'What invariants should the reducer preserve?',
      'Why are totals better derived than stored?',
      'What tests would you write directly against the reducer?',
      'When would moving this reducer into Redux Toolkit be justified?',
    ],
    solutionPath: 'src/problems/04-cart/CartSolution.tsx',
    Solution: CartSolution,
  },
  {
    number: 5,
    slug: '05-registration',
    title: 'Multi-Step Registration Form',
    duration: '35–50 min',
    description: [
      'Build a three-step registration form:',
      'Tests controlled-form architecture, multi-step state modeling, validation timing, preserving state across conditional views, asynchronous submission states, and preventing duplicate work.',
    ],
    steps: [
      'Account: email and password',
      'Profile: display name and role',
      'Review and submit',
    ],
    codeIntro: 'Use this submission contract:',
    code: `type Registration = {
  email: string;
  password: string;
  displayName: string;
  role: "developer" | "designer" | "manager";
};

declare function register(
  values: Registration,
): Promise<{ userId: string }>;`,
    requirements: [
      'Preserve entered values while moving between steps.',
      'Prevent advancing until the current step is valid.',
      'Validate email format, a minimum eight-character password, and a non-empty display name.',
      'Show validation messages associated with their fields.',
      'Allow the user to return to an earlier step and edit values.',
      'Disable duplicate submissions while a request is pending.',
      'Show a submission error without discarding entered values.',
      'Show a success state after submission.',
      'Pressing Enter should behave sensibly for the current step.',
    ],
    constraint: 'Do not install a form library.',
    followUps: [
      'Would you use one state object, several state variables, or a reducer?',
      'When should validation run?',
      'How would asynchronous email-availability validation change the design?',
      'How would you warn users before navigating away with unsaved changes?',
    ],
    solutionPath:
      'src/problems/05-registration/RegistrationSolution.tsx',
    Solution: RegistrationSolution,
  },
  {
    number: 6,
    slug: '06-fetch-hook',
    title: 'Reusable Data-Fetching Hook',
    duration: '35–50 min',
    description: [
      'Implement a reusable useFetchJson hook and a component that demonstrates it.',
      'Tests effect lifecycle and reusable hook design: dependency management, asynchronous state machines, AbortController cleanup, stale requests, refetch triggers, generic TypeScript APIs, and stable callback behavior.',
    ],
    codeIntro: 'Target API:',
    code: `type FetchState<T> =
  | { status: "idle"; data: null; error: null }
  | { status: "loading"; data: null; error: null }
  | { status: "success"; data: T; error: null }
  | { status: "error"; data: null; error: Error };

function useFetchJson<T>(
  url: string | null,
): FetchState<T> & { refetch: () => void };`,
    requirements: [
      'Do not request anything when url is null.',
      'Request data when a non-null URL changes.',
      'Expose idle, loading, success, and error states.',
      'Provide a refetch function.',
      'Abort an obsolete request when the URL changes.',
      'Abort the active request when the consuming component unmounts.',
      'Ensure an aborted request is not shown as a user-facing error.',
      'Do not update state from an outdated request.',
      'Demonstrate the hook by loading and rendering a list of users.',
    ],
    constraint:
      'Use the browser fetch API. Do not install a request library.',
    followUps: [
      'Why is fetching usually an effect while transforming fetched data is not?',
      'What should be included in the effect dependency array?',
      'What limitations would this hook have compared with a server-state library?',
      'How would caching, deduplication, retries, or SSR affect the design?',
    ],
    solutionPath: 'src/problems/06-fetch-hook/FetchHookSolution.tsx',
    Solution: FetchHookSolution,
  },
  {
    number: 8,
    slug: '08-toasts',
    title: 'Toast Notification System',
    duration: '35–50 min',
    description: [
      'Build a toast system that any descendant component can use without passing callbacks through every intermediate component.',
      'Tests lifecycle and application architecture: context and reducer APIs, provider boundaries, timer ownership, cleanup, stable function identities, context-driven rerenders, and assistive-technology announcements.',
    ],
    codeIntro: 'Target usage:',
    code: `function SaveButton() {
  const { addToast } = useToasts();

  return (
    <button onClick={() => addToast("Changes saved", "success")}>
      Save
    </button>
  );
}`,
    requirements: [
      'Provide a ToastProvider and useToasts hook.',
      'Support success, error, and informational toasts.',
      'Give every toast a stable unique ID.',
      'Render multiple toasts in the order they were added.',
      'Automatically dismiss each toast after five seconds.',
      'Allow manual dismissal.',
      'Clean up timers when a toast is dismissed or the provider unmounts.',
      'Throw a clear error if useToasts is called outside its provider.',
      'Announce important messages appropriately to assistive technology.',
      'Avoid needless context-driven rerenders where practical.',
    ],
    constraint: 'Use context plus a reducer. Do not install a toast library.',
    followUps: [
      'Why is context appropriate for this API?',
      'Which context values may need stable identities?',
      'Where should timers be owned?',
      'How would you add pause-on-hover or exit animations?',
    ],
    solutionPath: 'src/problems/08-toasts/ToastsSolution.tsx',
    Solution: ToastsSolution,
  },
  {
    number: 9,
    slug: '09-activity-feed',
    title: 'Infinite-Scrolling Activity Feed',
    duration: '35–50 min',
    description: [
      'Build an activity feed that loads the next page as the user nears the bottom.',
      'Tests React lifecycle with browser APIs: IntersectionObserver ownership, refs versus state, effect cleanup, cursor-based async pagination, request deduplication, cancellation, retries, and append-only state updates.',
    ],
    codeIntro: 'Use this API contract:',
    code: `type Activity = {
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
): Promise<ActivityPage>;`,
    requirements: [
      'Load the first page when the feed mounts.',
      'Load the next page when a sentinel element becomes visible.',
      'Use IntersectionObserver rather than a global scroll listener.',
      'Do not make duplicate requests for the same cursor.',
      'Append new pages without discarding existing activities.',
      'Stop observing for additional pages when nextCursor is null.',
      'Show initial-loading, loading-more, empty, and error states.',
      'Let the user retry a failed page.',
      'Abort active work when the feed unmounts.',
      'Use stable keys for feed items.',
    ],
    followUps: [
      'Which values belong in state versus refs?',
      'How would you handle a backend that returns a duplicate item?',
      'How would you preserve scroll position across navigation?',
      'At what point would DOM virtualization become necessary?',
    ],
    solutionPath:
      'src/problems/09-activity-feed/ActivityFeedSolution.tsx',
    Solution: ActivityFeedSolution,
  },
  {
    number: 2,
    slug: '02-file-explorer',
    title: 'Nested File Explorer',
    duration: '35–50 min',
    description: [
      'Build an interactive file explorer from nested data.',
      'Tests React fundamentals: recursive component composition, stable keys, immutable UI state kept separate from props, preserving independent folder state, lifting selection state, and accessible interactive controls.',
    ],
    codeIntro: 'Use this type:',
    code: `type FileNode =
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
    };`,
    requirements: [
      'Render files and folders at any nesting depth.',
      'Folders start collapsed.',
      'Clicking a folder toggles only that folder.',
      'Display a visible nesting level without encoding it into the data.',
      'Preserve the open state of other folders when one folder is toggled.',
      'Allow a file to be selected and visibly indicate the selection.',
      'Notify the parent through onSelect(file) when selection changes.',
      'Use buttons for interactive folder controls.',
      'Include aria-expanded on folder controls.',
      'Avoid using array indexes as keys.',
    ],
    constraint:
      'Do not mutate the supplied tree and do not add UI state directly to its nodes.',
    followUps: [
      'Where should expanded-folder state live?',
      'What are the tradeoffs between recursive components and flattening the tree?',
      'How would keyboard navigation change the component design?',
      'How would you efficiently render a very large tree?',
    ],
    solutionPath:
      'src/problems/02-file-explorer/FileExplorerSolution.tsx',
    Solution: FileExplorerSolution,
  },
  {
    number: 11,
    slug: '11-pokeapi',
    title: 'Pokémon Stat Viewer',
    duration: '25–40 min',
    description: [
      'Build a small data explorer that fetches a Pokémon by name or Pokédex number and turns its response into an easy-to-scan profile.',
      'Practices the fundamentals of working with a public API: controlled input, fetch lifecycle states, basic response typing, request cancellation, and accessible data visualization.',
    ],
    codeIntro: 'Fetch a Pokémon from this endpoint and model the fields you use:',
    code: `const POKEMON_API = "https://pokeapi.co/api/v2/pokemon";

// Example: GET https://pokeapi.co/api/v2/pokemon/pikachu
type Pokemon = {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string | null;
  };
  types: Array<{
    type: { name: string };
  }>;
  stats: Array<{
    base_stat: number;
    stat: { name: string };
  }>;
};`,
    requirements: [
      'Start by loading Pikachu, then let the user search by Pokémon name or Pokédex number.',
      'Trim and normalize the search value before building the request URL.',
      'Show distinct loading, error, and success states.',
      'Treat a not-found response as a useful message rather than a generic failure.',
      'Display the Pokémon name, Pokédex number, sprite, height, weight, and types.',
      'Visualize each base stat with a labeled horizontal bar whose value is also available as text.',
      'Disable or otherwise guard against an empty search.',
      'Ensure an older request cannot replace the result of a newer search.',
      'Keep the last successful profile visible only if that behavior is intentional and clearly communicated.',
    ],
    constraint:
      'Use the browser fetch API and plain HTML/CSS for the visualization. Do not install a charting or request library.',
    followUps: [
      'Which values belong in state, and which can be derived from the response during render?',
      'How would you cancel an obsolete request when a user searches again quickly?',
      'How would you make the stat bars understandable without relying on color or width alone?',
      'What would you cache if users frequently revisit the same Pokémon?',
    ],
    solutionPath: 'src/problems/11-pokeapi/PokeApiSolution.tsx',
    Solution: PokeApiSolution,
  },
]

export const problems = [...problemDefinitions].sort(
  (first, second) => first.number - second.number,
)

export function getProblemBySlug(slug: string) {
  return problems.find((problem) => problem.slug === slug)
}
