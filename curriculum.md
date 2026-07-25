# Modern React Interview Refresher

This curriculum is for an experienced JavaScript/frontend engineer who has spent
the last few years on backend work. It assumes that JavaScript, HTML, CSS, HTTP,
and general engineering fundamentals are already strong. The goal is to rebuild
React fluency, refresh browser-specific knowledge, and practice explaining
frontend decisions at interview depth.

The examples use function components, hooks, and TypeScript. Know how class
lifecycle methods map to effects well enough to read legacy code, but do not
spend much preparation time writing class components unless a target company
explicitly uses them.

## Outcomes

By the end, you should be able to:

- Predict when a component renders, commits, preserves state, or resets state.
- Choose state shapes and component boundaries without creating synchronization
  bugs.
- Use hooks without stale closures, dependency omissions, leaking effects, or
  unnecessary memoization.
- Implement common interactive components in 30–45 minutes while narrating
  tradeoffs.
- Test behavior rather than implementation details.
- Discuss accessibility, performance, data fetching, API design, security, and
  rendering strategies in a full-stack system design.
- Diagnose broken React code aloud, not merely produce working code.

## How to use this curriculum

Use a four-week schedule, five sessions per week, for 60–90 minutes per session.
Compress it to two weeks by doing two sessions per day.

For each session:

1. Spend 10 minutes recalling the topic without notes.
2. Spend 20 minutes answering the listed questions aloud.
3. Spend 30–45 minutes coding or debugging without autocomplete-heavy help.
4. Spend 10 minutes reviewing your work against the checkpoints.
5. Write down one rule you missed and one example that demonstrates it.

For an interview answer, use this compact pattern:

1. State the mental model or default rule.
2. Give a small concrete example.
3. Name the failure mode or tradeoff.
4. Mention when you would choose an alternative.

Do not memorize hook definitions in isolation. Interviewers generally learn more
from whether you can predict behavior, identify a bug, and defend a design.

## Four-week plan

| Week | Focus | Main deliverable |
| --- | --- | --- |
| 1 | Rendering, state, reconciliation, forms | Searchable todo app |
| 2 | Hooks, effects, async work, custom hooks | Stopwatch and autocomplete |
| 3 | Architecture, performance, testing, accessibility | Data table and modal |
| 4 | Full-stack integration, modern React, system design | Dashboard design and mocks |

---

# Week 1: Rebuild the React mental model

## Day 1: Render, commit, props, and state

Review:

- A component is a function React calls to calculate a description of UI.
- Rendering should be pure. The same inputs should produce the same JSX without
  changing external state.
- Render and commit are separate phases. Browser painting is separate again.
- Props are read-only inputs. State is a component's memory.
- State is a snapshot for one render; calling a setter schedules future work and
  does not mutate the current render's value.

Common interview questions:

### 1. What causes a React component to render?

A strong answer should cover:

- Its own state update.
- Its parent rendering, unless React can safely skip it.
- A consumed context value changing.
- An external store subscription notifying it.
- A render does not necessarily mean the DOM changes; reconciliation may produce
  no host changes.
- `React.memo` is a performance optimization, not a semantic guarantee or a way
  to prevent all renders.

### 2. What is the difference between render and commit?

A strong answer should cover:

- Render calculates the next tree and must remain pure.
- Commit applies the necessary host changes and updates refs.
- Effects run in relation to commits, not while JSX is being calculated.
- React may start, pause, repeat, or abandon render work, so side effects during
  render are unsafe.

### 3. Why does logging state immediately after `setState` show the old value?

A strong answer should cover:

- Each render closes over a fixed state snapshot.
- The setter queues an update; it does not rewrite the current variable.
- Code later in the same event handler still sees that render's snapshot.
- If the next value depends on the previous value, use a functional updater.

### 4. What does batching mean?

A strong answer should cover:

- React groups multiple state updates so it can render efficiently.
- Repeated `setCount(count + 1)` calls calculate from the same captured value.
- Repeated `setCount(c => c + 1)` calls compose through the update queue.
- Do not rely on DOM being updated immediately after a setter.

Gotcha lab:

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  function incrementThreeTimes() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  }

  return <button onClick={incrementThreeTimes}>{count}</button>;
}
```

Questions:

- What value appears after one click, and why?
- Change it so one click adds three.
- When is `setCount(count + 1)` still the clearest form?

Checkpoint: explain "state as a snapshot" without saying only that state is
"asynchronous," which is imprecise and hides the real model.

## Day 2: State design and immutability

Review:

- Store the minimum source of truth.
- Derive values during render when they are cheap and deterministic.
- Avoid contradictory, redundant, duplicate, and needlessly nested state.
- Treat objects and arrays in state as immutable.
- Lift state to the nearest common owner when siblings must coordinate.
- Prefer an ID in state over a duplicate copy of an entity.

Common interview questions:

### 5. How do you decide whether a value belongs in state?

Ask:

- Can it be calculated from props or existing state?
- Does changing it need to cause a render?
- Is it temporary mutable data that belongs in a ref instead?
- Is it server data whose ownership and cache lifetime differ from UI state?
- Could two stored values disagree and create an impossible state?

### 6. Why should React state not be mutated directly?

A strong answer should cover:

- React observes replacement through setter calls; mutating an existing value can
  leave React without a useful update signal.
- Previous render snapshots should remain reliable.
- Referential equality enables efficient comparisons and memoization.
- Shallow copying only the top level is insufficient when a nested value is also
  mutated.

Gotcha lab:

```tsx
type Item = { id: string; label: string; done: boolean };

function toggle(items: Item[], id: string) {
  const item = items.find(item => item.id === id);
  if (item) item.done = !item.done;
  return [...items];
}
```

Questions:

- Why is the returned array new but the update still conceptually broken?
- Rewrite it with `map`.
- How could this mutation break a memoized child or time-travel debugging?

State-design drill:

Refactor this state shape:

```tsx
const [products, setProducts] = useState<Product[]>([]);
const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
const [isEmpty, setIsEmpty] = useState(true);
const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
  "idle",
);
const [error, setError] = useState<string | null>(null);
```

Discuss which values are authoritative, which are derived, and whether the
request state permits contradictory combinations.

## Day 3: Reconciliation, keys, and state lifetime

Review:

- React matches elements by type, position, and key.
- State is associated with a position in the rendered tree, not stored inside a
  JSX tag.
- A stable key identifies an item among its siblings.
- Changing a key intentionally resets a subtree.
- Defining a component inside another component creates a new component type on
  each render and can reset state.

Common interview questions:

### 7. Why are keys needed, and why is an array index often a bad key?

A strong answer should cover:

- Keys help React preserve identity when siblings are inserted, removed, or
  reordered.
- An index describes a position, not the identity of an item.
- Unstable identity can move local state or DOM state to the wrong row.
- Index keys are acceptable for truly static, never-reordered lists without
  item-local identity.
- `key` is special React metadata and is not passed to the child as a normal
  prop.

### 8. When would you deliberately use a key outside a list?

Examples:

- Reset a form when switching from one customer or conversation to another.
- Restart an animation or discard local draft state for a new entity.
- Prefer explicit ownership and lifting state when preservation is desired.

Gotcha lab:

```tsx
function ContactList({ contacts }: { contacts: Contact[] }) {
  return contacts.map((contact, index) => (
    <ContactRow key={index} contact={contact} />
  ));
}

function ContactRow({ contact }: { contact: Contact }) {
  const [note, setNote] = useState("");
  // ...
}
```

Explain what can happen to `note` after sorting the contacts. Fix it.

State-reset lab:

```tsx
function ProfilePage({ userId }: { userId: string }) {
  return <ProfileForm userId={userId} />;
}
```

Add one deliberate change so `ProfileForm` discards its local draft whenever
`userId` changes. Then discuss when silently discarding that draft would be bad
UX.

## Day 4: Events, controlled components, and forms

Review:

- Event handlers describe interaction-specific work.
- Controlled inputs receive their current value from React state.
- Uncontrolled inputs retain state in the DOM and can be read through refs or
  form APIs.
- A form needs labels, keyboard behavior, validation, pending/error states, and
  focus management—not just an `onSubmit`.
- Preventing default browser behavior and stopping propagation solve different
  problems.

Common interview questions:

### 9. Controlled versus uncontrolled inputs: when would you use each?

A strong answer should cover:

- Controlled inputs simplify synchronized validation, formatting, conditional UI,
  and a single React source of truth.
- Uncontrolled inputs can be simpler for basic forms, native form submission,
  file inputs, or integration with non-React code.
- A component should not switch an input between controlled and uncontrolled
  during its lifetime.
- Large form libraries may use uncontrolled techniques to avoid rerendering the
  whole form on each keystroke.

### 10. What is the difference between `preventDefault` and `stopPropagation`?

- `preventDefault()` cancels a browser default action, such as form navigation.
- `stopPropagation()` stops an event from continuing through the propagation
  path.
- They are not interchangeable; propagation and browser defaults are separate.

Implementation drill: reusable login form

Requirements:

- Email and password fields with real labels.
- Inline validation shown at an appropriate time.
- Submit on Enter.
- Disable duplicate submissions while pending.
- Preserve typed values after a server error.
- Put focus on an error summary or the first invalid field.
- Expose a typed `onSubmit(credentials)` API.

Follow-ups:

- What validation belongs in the browser, API, and database?
- How do password managers affect markup decisions?
- How do you avoid updating state after navigation?
- What should be announced to a screen reader?

## Day 5: Build a searchable todo app

Timebox: 45 minutes implementation, 15 minutes review.

Requirements:

- Add, toggle, edit, and delete todos.
- Filter by all/active/completed.
- Search by text.
- Keep one canonical todo array; derive filtered results.
- Use stable IDs.
- Persist to `localStorage` with a defensible effect.
- Support keyboard submission and accessible labels.
- Write at least three behavior-focused tests.

Interviewer follow-ups:

- Which state should move to the URL?
- How would you synchronize across browser tabs?
- How would the design change with a server as the source of truth?
- What happens if persistence throws or stored JSON is corrupt?
- Where would optimistic updates belong?

Review checklist:

- No effect exists solely to calculate filtered todos.
- No state object or array is mutated.
- Effects have complete dependency lists and cleanup where relevant.
- Empty states and errors are explicit.
- Tests interact by role/label rather than querying implementation classes.

---

# Week 2: Hooks, effects, and asynchronous behavior

## Day 6: Rules of hooks and closures

Review:

- Call hooks only at the top level of React components or custom hooks.
- Hook order is how React associates calls with stored hook state.
- Every render creates new functions that close over that render's props and
  state.
- A stale closure is normal JavaScript closure behavior exposed by delayed work,
  not React randomly caching a variable.
- Functional state updates help when a new value depends on queued previous
  state. Refs help when delayed code must read mutable current data without
  rendering.

Common interview questions:

### 11. Why can't hooks be called conditionally?

A strong answer should cover:

- React relies on consistent hook call order between renders.
- A conditional call shifts subsequent hook positions.
- Put the condition inside the effect or extract a component with its own hooks.

### 12. What is a stale closure in React?

Use this example:

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setCount(count + 1);
    }, 1000);

    return () => window.clearInterval(id);
  }, []);

  return <output>{count}</output>;
}
```

Explain:

- Why it reaches `1` and appears stuck.
- Why adding `count` to the dependencies works but recreates the interval.
- Why `setCount(current => current + 1)` is a cleaner solution for this exact
  requirement.
- Why a stopwatch that must track wall-clock time should not merely add one on
  every interval tick.

## Day 7: Effects as synchronization

Review:

- An effect synchronizes React with an external system after commit.
- Event-specific work belongs in the event handler.
- Values that can be derived during render usually do not need an effect.
- Effect dependencies describe the reactive values the synchronization reads.
- Cleanup undoes the previous synchronization before the next one or unmount.
- In development, Strict Mode intentionally stresses effect cleanup and render
  purity; code should work after setup → cleanup → setup.

Common interview questions:

### 13. When do you need `useEffect`?

Good examples:

- Subscribe/unsubscribe to an external service.
- Start/stop a timer.
- Synchronize a media player, map, DOM API, or third-party widget.
- Perform analytics because a screen was displayed.
- Fetch data when the chosen architecture performs client-side fetching.

Usually bad examples:

- Calculate a filtered list.
- Copy props into state by default.
- Call a parent callback whenever local state changes when both can be updated in
  the originating event.
- Handle a purchase because a `shouldPurchase` flag changed.

### 14. How do you choose an effect dependency array?

A strong answer should cover:

- Do not choose dependencies to control timing manually.
- Include every reactive value read by the effect.
- Stabilize or move code only when its semantics justify it.
- An empty array means the effect reads no changing component values; it does not
  mean "run once" as a universal semantic guarantee.
- Do not suppress the hooks linter to conceal a stale closure.

Bug-finding drill:

```tsx
function ProductList({ category }: { category: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [sort, setSort] = useState<"name" | "price">("name");
  const [visible, setVisible] = useState<Product[]>([]);

  useEffect(() => {
    fetch(`/api/products?category=${category}`)
      .then(response => response.json())
      .then(setProducts);
  }, []);

  useEffect(() => {
    setVisible([...products].sort(compareBy(sort)));
  }, [products]);

  // ...
}
```

Find at least four problems or design concerns. Consider stale inputs, missing
error states, request races, redundant derived state, missing dependencies,
response validation, and cancellation/ignore cleanup.

## Day 8: `useRef`, DOM escape hatches, and timers

Review:

- A ref object retains its identity between renders.
- Changing `ref.current` does not trigger a render.
- Use refs for DOM nodes, timer IDs, external instances, and mutable values that
  should not drive visible output.
- Do not read or write refs during render except predictable initialization.
- Use state, not a ref, for data the user must see update.

Common interview questions:

### 15. State versus ref: how do you choose?

Use state when a change should recalculate visible UI. Use a ref when the value
must survive renders but changing it should not itself render, such as an
interval ID or a DOM node.

### 16. How do you expose focus or scroll behavior from a reusable component?

Discuss:

- Prefer declarative props when practical.
- Forward a DOM ref or expose a small imperative handle when imperative control
  is genuinely needed.
- Avoid exposing a component's entire internal DOM structure as its public API.

## Core coding exercise: stopwatch with hooks

This is a high-value React interview exercise because it tests state modeling,
refs, effects, closures, cleanup, time calculations, and edge cases.

### Requirements

- Display elapsed time to tenths or hundredths of a second.
- Provide Start, Pause, Resume, and Reset.
- Starting while already running must not create another interval.
- Paused time must not count toward elapsed time.
- Reset must work while paused and while running.
- Clean up scheduled work on unmount.
- Keep the displayed value accurate even if ticks are delayed by a busy main
  thread or a background tab.
- Use an accessible text label for the elapsed value and real buttons.

Before coding, propose the state model. A useful minimal model is:

- Rendered state: accumulated elapsed milliseconds and whether it is running.
- Ref: the wall-clock timestamp when the current running segment began.
- Effect-owned resource: the interval ID, created and cleared with the running
  synchronization.

Do not treat "number of ticks × interval delay" as elapsed wall-clock time.
Timers are not precise schedulers.

### One reference implementation

Write your own version before reading this.

```tsx
import { useEffect, useRef, useState } from "react";

const UPDATE_INTERVAL_MS = 50;

export function Stopwatch() {
  const [elapsedBeforeRun, setElapsedBeforeRun] = useState(0);
  const [displayedElapsed, setDisplayedElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const startedAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRunning) return;

    startedAtRef.current = performance.now();

    const updateDisplayedTime = () => {
      const startedAt = startedAtRef.current;
      if (startedAt === null) return;
      setDisplayedElapsed(elapsedBeforeRun + (performance.now() - startedAt));
    };

    updateDisplayedTime();
    const intervalId = window.setInterval(
      updateDisplayedTime,
      UPDATE_INTERVAL_MS,
    );

    return () => window.clearInterval(intervalId);
  }, [elapsedBeforeRun, isRunning]);

  function pause() {
    if (!isRunning || startedAtRef.current === null) return;

    const nextElapsed =
      elapsedBeforeRun + (performance.now() - startedAtRef.current);
    setElapsedBeforeRun(nextElapsed);
    setDisplayedElapsed(nextElapsed);
    setIsRunning(false);
    startedAtRef.current = null;
  }

  function reset() {
    setElapsedBeforeRun(0);
    setDisplayedElapsed(0);
    startedAtRef.current = isRunning ? performance.now() : null;
  }

  const seconds = (displayedElapsed / 1000).toFixed(2);

  return (
    <section aria-label="Stopwatch">
      <output aria-live="off" aria-label={`${seconds} seconds elapsed`}>
        {seconds}
      </output>
      <button type="button" onClick={() => setIsRunning(true)}>
        {isRunning ? "Running" : elapsedBeforeRun > 0 ? "Resume" : "Start"}
      </button>
      <button type="button" onClick={pause} disabled={!isRunning}>
        Pause
      </button>
      <button type="button" onClick={reset}>
        Reset
      </button>
    </section>
  );
}
```

Review questions:

- Why is the interval a synchronization effect?
- Why is the timer ID local to the effect but the start timestamp in a ref?
- Why does the effect cleanup prevent duplicate intervals?
- What behavior does Strict Mode exercise here?
- Why use clock differences instead of adding `50` on every tick?
- Why is `performance.now()` preferable to `Date.now()` for an in-page stopwatch,
  and when would a persistent timestamp still require wall-clock time?
- What happens when Reset runs while the stopwatch is running?
- Would `requestAnimationFrame` be better? Discuss display frequency, background
  behavior, and whether the UI needs frame-level updates.
- Could the two elapsed state values be simplified? Try an alternative model and
  compare event-handler complexity.
- How would you test it with fake timers and a mocked clock?

Stretch requirements:

- Add laps without mutating prior lap records.
- Show lap deltas and total time.
- Persist an active timer through a page reload.
- Pause when the document becomes hidden.
- Build a countdown variant that never displays a negative time.

## Day 9: Async fetching, races, and custom hooks

Review:

- Model idle, loading, success, empty, and error states explicitly.
- A later request should win over an earlier stale response.
- Cleanup can abort a request or mark its result as irrelevant.
- Check `response.ok`; a fulfilled `fetch` promise does not imply a successful
  HTTP status.
- Separate transport data validation and domain mapping from presentation.
- In production, a query/cache library or framework loader may own fetching,
  deduplication, caching, retries, and invalidation.

Common interview questions:

### 17. How do you prevent a request race when a prop changes quickly?

A strong answer should cover:

- Create an `AbortController` per effect and abort it in cleanup, or ignore
  results from obsolete requests.
- Still handle the possibility that cancellation is advisory or work has moved
  beyond the cancellable phase.
- Ensure loading and error updates also belong to the active request.
- Explain what a data-fetching library would manage.

### 18. What makes a good custom hook?

A strong answer should cover:

- It packages reusable stateful behavior, not merely any shared function.
- Its name starts with `use`, and it obeys the rules of hooks.
- Each call has isolated state unless it subscribes to a shared external source.
- Its API should expose intent and hide resource cleanup.
- Avoid a giant generic hook with boolean switches for unrelated behaviors.

Implementation drill: `useDebouncedValue`

```tsx
function useDebouncedValue<T>(value: T, delayMs: number): T {
  // Implement with cleanup.
}
```

Follow-ups:

- How should it behave when `delayMs` changes?
- Why is debouncing the value different from debouncing an arbitrary callback?
- When should search update immediately, and when should the network request be
  deferred?
- How will an aborted request interact with the debounced value?

## Day 10: Build autocomplete

Timebox: 45 minutes implementation, 20 minutes discussion.

Requirements:

- Fetch suggestions after a short debounce.
- Do not request an empty query.
- Cancel or ignore stale requests.
- Represent loading, empty, and error states.
- Support Arrow Up/Down, Enter, Escape, and mouse selection.
- Preserve input focus while clicking an option.
- Use combobox/listbox semantics or explain what remains to make it accessible.
- Cache recent query results in memory as a stretch goal.

Interviewer follow-ups:

- Debounce or throttle: which and why?
- How would you prevent API abuse?
- What should be encoded into the URL?
- Where should caching live?
- How would you handle IME composition?
- How would server rendering affect the first result set?

---

# Week 3: Component design, performance, testing, and accessibility

## Day 11: Component APIs and composition

Review:

- Prefer components organized around responsibilities and change boundaries, not
  arbitrary line counts.
- Composition often scales better than configuration via many boolean props.
- Controlled/uncontrolled is also a component API design choice.
- Context is dependency injection through a tree, not automatically a complete
  state-management solution.
- Reducers are valuable when transitions are complex or benefit from explicit
  events.

Common interview questions:

### 19. Prop drilling versus context: when is context appropriate?

A strong answer should cover:

- Passing props is explicit and often simplest.
- Context is useful for tree-wide dependencies such as theme, locale, auth
  session, or a coordinated compound component.
- Every consumer can update when the provider value identity changes.
- Split contexts by concern and stabilize provider values only when measurements
  justify it.
- Frequently changing remote data often needs subscription/cache semantics beyond
  a single broad context.

### 20. When would you use `useReducer` instead of several `useState` calls?

A strong answer should cover:

- Related transitions are easier to express as events.
- A reducer centralizes update logic and makes invalid transitions visible.
- It is useful for complex forms, state machines, undo/redo, or multiple actions
  affecting the same state.
- A reducer must be pure and does not itself solve shared/global state.
- Do not introduce it for a couple of independent booleans without a reason.

### Very basic Redux Toolkit primer

Redux is an external store for state that must be shared across distant parts of
an application or updated through well-defined events. Modern Redux code should
normally use Redux Toolkit (RTK), which supplies the standard store setup and
removes most of the old hand-written Redux boilerplate.

The core pieces are:

- **Store:** holds the application's Redux state tree.
- **Slice:** owns one domain's initial state, reducer logic, and generated action
  creators.
- **Action:** a plain object describing what happened, such as
  `{ type: "greeting/addEnthusiasm" }`.
- **Reducer:** calculates the next state from the current state and an action.
- **Dispatch:** sends an action to the store.
- **Selector:** reads or derives a value from store state.
- **Provider:** makes the store available to React components.

The one-way data flow is:

1. A user interaction dispatches an action.
2. The store runs the reducers with the current state and that action.
3. RTK's Immer integration lets slice reducers use mutation-like syntax while
   safely producing immutable state.
4. Components whose selected values changed render again.

This project's hello-world example follows that flow:

- `src/app/store.ts` combines the slice reducers with `configureStore`.
- `src/main.tsx` supplies the store through React Redux's `Provider`.
- `src/features/greeting/greetingSlice.ts` defines the greeting state and
  actions with `createSlice`.
- `src/app/hooks.ts` exports typed dispatch and selector hooks.
- `src/App.tsx` selects the greeting and dispatches `addEnthusiasm`.

The essential component pattern is:

```tsx
const message = useAppSelector((state) => state.greeting.message);
const dispatch = useAppDispatch();

return (
  <button onClick={() => dispatch(addEnthusiasm())}>
    {message}
  </button>
);
```

Redux is not the default home for every value. Keep state local when only one
small subtree needs it, use context for relatively stable tree-wide
dependencies, and use a server-state library when request caching,
revalidation, and deduplication are the main problem. Reach for Redux when
shared client state, explicit event-driven transitions, middleware, or strong
debugging tools justify the extra indirection.

Primer exercise:

1. Run the app and click **Dispatch addEnthusiasm**.
2. Trace the click from `dispatch`, to the generated action, to the slice
   reducer, to the selector-driven render.
3. Add a `removeEnthusiasm` reducer that never lets the count fall below one.
4. Explain why the reducer remains pure even though `state.enthusiasm += 1`
   looks like mutation.

Design exercise:

Design a reusable `Dialog` API. Compare:

```tsx
<Dialog
  title="Delete project?"
  confirmText="Delete"
  showCloseButton
  destructive
  body="This cannot be undone."
/>
```

with a compositional API:

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <Dialog.Title>Delete project?</Dialog.Title>
  <Dialog.Body>This cannot be undone.</Dialog.Body>
  <Dialog.Actions>{/* buttons */}</Dialog.Actions>
</Dialog>
```

Discuss discoverability, flexibility, accessibility defaults, and the risk of
allowing invalid composition.

## Day 12: Memoization and performance

Review:

- First identify the user-visible performance problem and measure it.
- A parent render normally evaluates its child elements.
- `React.memo` can skip a child when props are shallowly equal.
- `useMemo` caches a calculated value; `useCallback` caches a function identity.
- Memoization adds comparison work, dependency complexity, and memory use.
- New object, array, and function identities can defeat shallow memoization.
- Moving state down, accepting children, and avoiding unnecessary effects may
  help more than scattering memo hooks.
- Modern tooling may automate some memoization, but interviewers still expect the
  underlying identity and rendering model.

Common interview questions:

### 21. `useMemo` versus `useCallback` versus `React.memo`?

- `useMemo` memoizes a returned calculation result.
- `useCallback` memoizes the function object itself.
- `React.memo` memoizes a component render based on props.
- They address related identity/render costs but are not interchangeable.
- None should be used as a correctness mechanism.

### 22. How would you investigate a slow React page?

A strong sequence:

1. Reproduce with realistic data and a production build.
2. Determine whether the bottleneck is network, JavaScript, rendering, layout,
   painting, or too much DOM.
3. Use browser performance tools and the React Profiler.
4. Find expensive commits and why components rendered.
5. Fix architecture or work volume: localize state, virtualize large lists,
   reduce effects, cache expensive computation, split work, or optimize the
   actual hot child.
6. Measure again and guard the improvement.

Gotcha lab:

```tsx
const Row = memo(function Row({
  item,
  onSelect,
}: {
  item: Item;
  onSelect: (id: string) => void;
}) {
  return <button onClick={() => onSelect(item.id)}>{item.name}</button>;
});

function List({ items }: { items: Item[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return items.map(item => (
    <Row
      key={item.id}
      item={{ ...item }}
      onSelect={id => setSelectedId(id)}
    />
  ));
}
```

Why does memoization fail to skip rows? Produce a simpler fix before reaching
for both `useMemo` and `useCallback`.

## Day 13: Testing React behavior

Review:

- Test observable behavior through the public UI.
- Prefer queries matching how users and assistive technology find elements:
  role, accessible name, label, and text.
- A healthy mix includes fast unit tests, component integration tests, and a
  smaller number of end-to-end tests.
- Mock at stable boundaries such as the network, not React internals.
- Account for asynchronous UI and avoid arbitrary sleeps.
- Strict Mode can reveal missing cleanup that a shallow happy-path test misses.

Common interview questions:

### 23. What should you test in a React component?

A strong answer should cover:

- Initial visible state and important conditional states.
- User interaction and resulting behavior.
- Loading, empty, error, success, and retry paths.
- Keyboard and accessibility behavior.
- Integration contracts with the network or router.
- Avoid asserting hook calls, internal state variables, or exact DOM structure
  unless structure is itself a contract.

### 24. Unit, integration, or end-to-end: which gives the most confidence?

There is no universal winner. Discuss cost, speed, fidelity, failure diagnosis,
and the risk each layer covers. For interactive UI, component integration tests
often provide strong value, while end-to-end tests protect a few critical user
journeys.

Testing drill: stopwatch

Write tests for:

- Starts at zero.
- Advances according to the mocked clock after Start.
- Pause freezes the display.
- Resume preserves accumulated time.
- Reset while paused clears it.
- Reset while running restarts from zero without stopping.
- Repeated Start does not create duplicate progress.
- Unmount cleans up the timer.

Avoid asserting an implementation detail such as the exact number of
`setInterval` calls unless resource creation is the behavior under test.

## Day 14: Accessibility and browser behavior

Review:

- Use semantic HTML before ARIA.
- All interactive behavior must be keyboard reachable and have a visible focus
  state.
- Controls need accessible names.
- Focus management is essential for dialogs, menus, route changes, and validation
  errors.
- Color alone should not convey meaning.
- Dynamic announcements should be intentional; a stopwatch should not announce
  every 50 ms.
- Event propagation, focus, layout, and browser defaults remain relevant inside
  React.

Common interview questions:

### 25. How would you make a modal accessible?

A strong answer should cover:

- Use the native `<dialog>` where appropriate or correct dialog semantics.
- Move focus into it when opened.
- Keep keyboard focus within the active modal interaction.
- Escape closes when allowed.
- Restore focus to the triggering control.
- Provide an accessible title and description.
- Prevent background interaction and consider scroll locking.
- Render through a portal if stacking/overflow requires it; events still belong
  to the React tree.

### 26. Why is a clickable `<div>` not equivalent to a `<button>`?

A native button already provides focusability, keyboard activation, role,
disabled semantics, form behavior, and platform conventions. Recreating all of
that is error-prone.

Implementation drill: accessible modal

Requirements:

- Open from a trigger and close by button or Escape.
- Restore trigger focus.
- Handle initial focus.
- Close on backdrop click but not content click.
- Prevent background interaction.
- Add a test using keyboard-only interaction.

Follow-ups:

- What changes for a destructive confirmation?
- Should every click outside close it?
- How do portals affect event propagation and testing?
- What should happen with nested dialogs?

## Day 15: Build a sortable, paginated data table

Requirements:

- Loading, empty, error, and populated states.
- Sortable columns with visible and programmatic sort state.
- Pagination.
- Row selection using stable IDs.
- Query state reflected in the URL.
- Responsive behavior for narrow screens.
- Accessible headers and sort announcements.
- No unnecessary copy of filtered/sorted rows in state.

Follow-ups:

- Client-side or server-side sort and pagination?
- How does selection behave across pages?
- Offset versus cursor pagination?
- When is list virtualization appropriate?
- What is the cache key?
- How do new records affect page stability?

---

# Week 4: Full-stack React interviews

## Day 16: API integration and server-state ownership

Review:

- Separate ephemeral UI state, URL state, persistent client state, and server
  state.
- Define cache keys from all inputs that affect a response.
- Mutations require invalidation, direct cache updates, or both.
- Optimistic UI needs a rollback/reconciliation strategy.
- APIs must distinguish validation, authentication, authorization, conflict,
  rate-limit, and server failures.
- TypeScript types do not validate untrusted JSON at runtime.

Common interview questions:

### 27. How is server state different from local UI state?

Server state:

- Has remote ownership and can become stale independently.
- Is asynchronous and shared by multiple consumers.
- Benefits from caching, deduplication, revalidation, retries, and invalidation.

UI state:

- Usually has local synchronous ownership.
- Includes open panels, drafts, focus-related state, and current selections.

The categories can interact, but treating fetched data as just another global
client variable often recreates a poor cache.

### 28. How would you implement an optimistic update?

A strong answer should cover:

1. Capture enough previous state to roll back.
2. Apply a temporary update with a client-generated identity if necessary.
3. Send an idempotent or safely retryable mutation.
4. Reconcile the authoritative response.
5. Roll back or mark the item failed on error.
6. Consider concurrent edits, ordering, duplicate submission, and user feedback.

Exercise: optimistic todo creation

Discuss behavior for:

- Slow success.
- Validation failure.
- Network loss after the server committed.
- Two rapid submissions.
- Server-normalized text.
- Temporary IDs referenced by other pending actions.

## Day 17: Security and browser/network fundamentals

Refresh:

- Cookies, authorization headers, `SameSite`, `Secure`, and `HttpOnly`.
- CORS is a browser-enforced response-sharing policy, not authentication.
- CSRF exploits ambient credentials; mitigations depend on the auth design.
- XSS can turn readable browser credentials and user actions into attacker tools.
- React escapes interpolated text by default, but unsafe HTML, URLs, and
  third-party code still require care.
- Client-side authorization checks improve UX but never replace server-side
  authorization.
- Avoid exposing secrets in frontend bundles; build-time environment variables
  shipped to the browser are public.

Common interview questions:

### 29. Where should an access token be stored?

Do not give a one-line universal answer. Discuss the application's threat model:

- An `HttpOnly`, `Secure`, appropriately `SameSite` cookie limits direct
  JavaScript token theft but requires deliberate CSRF defenses and cookie scope.
- In-memory bearer tokens avoid persistent browser storage but still operate in
  an XSS-compromised page and complicate refresh.
- `localStorage` is simple and persistent but readable by any successful XSS.
- The server must enforce authorization regardless of the client choice.

### 30. Does React prevent XSS?

React escapes normal string interpolation, which removes a large class of unsafe
HTML injection. It does not make arbitrary HTML safe, validate dangerous URLs,
secure third-party scripts, or protect secrets exposed to the browser.

Scenario drill:

A React SPA calls an API on a different origin using an auth cookie. The request
works in an API client but fails in the browser.

Walk through:

- Browser origin and preflight behavior.
- API `Access-Control-*` response headers.
- Credentialed request configuration.
- Cookie domain, path, `SameSite`, and `Secure`.
- Why `Access-Control-Allow-Origin: *` cannot be combined with credential sharing.
- CSRF protection.
- Why disabling browser security is not a solution.

## Day 18: Rendering strategies and modern React

Know the tradeoffs, even if a role does not require framework expertise:

- Client-side rendering (CSR).
- Server-side rendering (SSR).
- Static generation and incremental regeneration.
- Hydration.
- Streaming and Suspense boundaries.
- Server and client component boundaries in frameworks that support them.
- Transitions for non-urgent updates.
- Optimistic UI and action-oriented form/mutation APIs.

Common interview questions:

### 31. CSR versus SSR: how would you choose?

Discuss:

- Time to meaningful content and SEO/crawler requirements.
- Server cost, caching, personalization, and CDN behavior.
- JavaScript download and hydration cost.
- Data-access latency and waterfalls.
- Operational complexity and failure modes.
- A route-by-route hybrid is often more useful than one universal strategy.

### 32. What causes a hydration mismatch?

Examples:

- Rendering current time or randomness differently on server and client.
- Browser-only checks that alter initial markup.
- Locale or timezone differences.
- Invalid HTML nesting corrected by the browser.
- Different data or IDs between server and client.

Explain why hiding the warning is not a general fix.

### 33. What problem do transitions solve?

A strong answer should cover:

- They mark non-urgent state work so urgent interaction can stay responsive.
- They do not make slow computation disappear or replace debouncing.
- Pending UI should remain understandable and accessible.
- Controlled text input updates themselves should remain urgent; derived result
  rendering may be transitioned.

### 34. What do error boundaries catch?

A strong answer should cover:

- They provide fallback UI for errors thrown while rendering a descendant and in
  relevant React lifecycle work.
- They do not generally catch errors from event handlers, arbitrary async
  callbacks, server rendering, or errors thrown inside the boundary itself.
- Handle expected request failures as application state; do not use an error
  boundary as the normal `404` or validation path.
- Place boundaries around meaningful failure regions so one broken panel does not
  necessarily replace the entire application.
- Suspense coordinates pending work; an error boundary handles failure. They are
  often placed together but solve different states.

### 35. Are React Server Components the same as server-side rendering?

No. A strong answer should distinguish:

- SSR generates initial HTML on the server and is commonly followed by hydration
  for client-interactive components.
- Server Components execute on the server and do not ship their component code to
  the browser; they can access server-side resources and compose with client
  boundaries.
- A framework can combine Server Components, SSR, streaming, and client
  components.
- Moving a boundary affects bundle size, interactivity, data access, serialization,
  caching, and where state/effects are allowed.

Recognition-only legacy question:

### 36. How do class lifecycles map to hooks?

Avoid claiming a one-to-one mapping. Effects describe synchronization lifecycles,
not component lifecycle buckets. Rough recognition:

- Constructor/state initialization → `useState` initializer.
- `componentDidMount`/`componentDidUpdate`/`componentWillUnmount` behavior often
  becomes one or more effects organized by external synchronization concern.
- Instance fields → refs where persistent mutable storage is appropriate.
- Error boundaries still require framework support or an error-boundary component;
  ordinary `try/catch` around JSX does not catch rendering errors in descendants.

## Day 19: Frontend system design

Practice this prompt:

> Design a project-management dashboard with a searchable project list, live
> status updates, a project detail panel, optimistic editing, role-based actions,
> deep links, and support for thousands of projects.

Use this sequence:

1. Clarify users, critical journeys, scale, latency, browser support, SEO,
   accessibility, and consistency requirements.
2. Define the domain model and API contracts.
3. Identify state ownership:
   - URL: search, filters, selected project, page/cursor.
   - Server cache: projects, project detail, permissions.
   - Local state: open menus, unsaved draft, temporary interaction state.
4. Draw component and data boundaries.
5. Explain fetching, caching, invalidation, errors, and request races.
6. Explain optimistic mutations and conflict handling.
7. Address performance: pagination/virtualization, code splitting, render scope,
   and measurement.
8. Address accessibility and responsive behavior.
9. Address auth, authorization, audit needs, XSS/CSRF, and sensitive data.
10. Address testing, observability, rollout, and failure recovery.

Follow-up questions:

- Polling, Server-Sent Events, or WebSockets for live status?
- How do you preserve a draft while fresh server data arrives?
- How do cache keys include organization, permissions, filters, and pagination?
- How do you avoid leaking one tenant's cached data into another session?
- What happens after a reconnect?
- How do you deep-link to a project while keeping back/forward behavior correct?
- What metrics distinguish a slow API from a slow render?

## Day 20: Full mock interview

Use a 90-minute format:

- 15 minutes: rapid concept questions.
- 35 minutes: implement one coding exercise.
- 20 minutes: debug two gotcha snippets.
- 15 minutes: design an extension to the component or its API.
- 5 minutes: summarize tradeoffs and identify what you would improve.

Suggested combinations:

1. State snapshot questions + stopwatch + stale closure + persistence design.
2. Keys/context questions + todo app + mutation bug + optimistic API design.
3. Effects/memo questions + autocomplete + request race + accessible combobox.
4. Rendering/testing questions + modal + focus bug + portal design.
5. Server-state/security questions + data table + cache bug + dashboard design.

Record yourself. Review whether you:

- Narrated assumptions before coding.
- Started with a minimal state model.
- Used semantic HTML.
- Covered cleanup and failure states.
- Explained tradeoffs without overengineering.
- Tested observable behavior.
- Left the code in a working, readable state.

---

# React gotcha question bank

Use these as 5–10 minute diagnosis drills. For each one, predict behavior before
running it, identify the violated mental model, and give the smallest clear fix.

## Gotcha 1: Derived state in an effect

```tsx
function Name({ first, last }: { first: string; last: string }) {
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    setFullName(`${first} ${last}`);
  }, [first, last]);

  return <span>{fullName}</span>;
}
```

Diagnosis: `fullName` is a cheap pure calculation. The effect introduces an
extra render and a temporarily stale value. Calculate it during render.

## Gotcha 2: Copying a prop into state

```tsx
function Editor({ document }: { document: Document }) {
  const [title, setTitle] = useState(document.title);
  // ...
}
```

Questions:

- What happens when `document` changes?
- Is the title a deliberate local draft or an accidental duplicate?
- Should the parent own the draft, should a key reset the editor, or should local
  edits survive navigation?

There is no safe fix without clarifying product semantics.

## Gotcha 3: Missing cleanup

```tsx
useEffect(() => {
  window.addEventListener("resize", updateLayout);
}, []);
```

Diagnosis: the listener is never removed, and `updateLayout` may also close over
stale values. Return cleanup and make the synchronization dependencies honest.

## Gotcha 4: Object dependency created during render

```tsx
const options = { roomId, serverUrl };

useEffect(() => {
  const connection = connect(options);
  return () => connection.disconnect();
}, [options]);
```

Diagnosis: `options` is new every render, so the effect reconnects. Construct the
object inside the effect from primitive dependencies, or memoize it if it also
has a genuine identity-sensitive consumer.

## Gotcha 5: Conditional hook

```tsx
if (isOpen) {
  useEffect(() => subscribe(), []);
}
```

Diagnosis: hook order changes. Always call the hook and put the condition inside
it, or render a child component only when open.

## Gotcha 6: Nested component definition

```tsx
function Page() {
  function SearchInput() {
    const [query, setQuery] = useState("");
    return <input value={query} onChange={event => setQuery(event.target.value)} />;
  }

  return <SearchInput />;
}
```

Diagnosis: every `Page` render creates a new component type, so React can reset
the child's state. Define `SearchInput` at module scope.

## Gotcha 7: Context provider identity

```tsx
<AuthContext.Provider value={{ user, signOut }}>
  {children}
</AuthContext.Provider>
```

Question: when is the new object identity material, and when would memoizing it
be cargo cult? First measure whether broad consumer renders are costly and
whether the context should be split by concern.

## Gotcha 8: Index key plus uncontrolled input

```tsx
{rows.map((row, index) => (
  <input key={index} defaultValue={row.name} />
))}
```

Delete the first row and predict what the remaining DOM inputs display. Explain
how both positional keys and `defaultValue` contribute to the surprise.

## Gotcha 9: Mutation hidden inside sorting

```tsx
const sorted = products.sort(compareByPrice);
```

Diagnosis: `sort` mutates the original array, which may be a prop or state
snapshot. Copy first or use a non-mutating alternative supported by the target
environment.

## Gotcha 10: Fetch race

```tsx
useEffect(() => {
  setLoading(true);
  fetchUser(userId).then(user => {
    setUser(user);
    setLoading(false);
  });
}, [userId]);
```

Questions:

- What if request A finishes after request B?
- What if the component unmounts or the request fails?
- How would abort/ignore cleanup work?
- Which concerns would a query library take over?

## Gotcha 11: Memoization defeated by children

```tsx
const Panel = memo(function Panel({ children }: PropsWithChildren) {
  return <section>{children}</section>;
});

<Panel>
  <ExpensiveChart data={data} />
</Panel>;
```

Question: why may the `children` prop have a new identity on each parent render?
More importantly, is `Panel` itself expensive enough for this to matter?

## Gotcha 12: Strict Mode duplicate behavior

```tsx
useEffect(() => {
  analytics.track("page-view");
}, []);
```

Question: why might this appear twice during development? Discuss idempotency,
cleanup, where analytics should be initialized, development filtering, and why
removing Strict Mode can hide rather than solve synchronization bugs.

## Gotcha 13: `useMemo` used for correctness

```tsx
const connection = useMemo(() => createConnection(url), [url]);
```

Diagnosis: creating and owning an external resource is effect synchronization,
not a pure calculation cache. Memoization is not a lifecycle guarantee and
provides no cleanup.

## Gotcha 14: Boolean soup

```tsx
const [isLoading, setIsLoading] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [isError, setIsError] = useState(false);
```

Question: which impossible states can this represent? Compare a discriminated
union such as:

```tsx
type RequestState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: Error };
```

## Gotcha 15: TypeScript is not runtime validation

```tsx
const response = await fetch("/api/user");
const user = (await response.json()) as User;
```

Diagnosis: the assertion does not check the payload. Validate untrusted data at
the boundary or rely on a generated/validated client contract with a clear
runtime story.

---

# Additional coding exercises

These are ordered by interview value. Implement the first four before spending
time on niche UI puzzles.

## 1. Tabs

- Controlled and uncontrolled API variants.
- Keyboard arrow navigation.
- State preservation versus resetting for inactive panels.
- Deep-link the active tab.

Tests: accessible selection state, keyboard navigation, and controlled updates.

## 2. Async button

- Prevent duplicate submission.
- Display pending, success, and error states.
- Handle unmount/navigation.
- Decide whether retries are automatic.

Follow-up: idempotency keys and the difference between disabling a button and
making a backend mutation safe.

## 3. Shopping cart

- Add, remove, and change quantity.
- Derive totals rather than synchronize them into state.
- Use a reducer for explicit actions.
- Persist locally, then redesign around a server cart.

Follow-up: price changes, inventory conflicts, currency precision, guest-to-user
cart merge, and optimistic mutations.

## 4. File upload

- Native file input.
- Type/size validation.
- Progress and cancellation.
- Per-file error states.
- Accessible status.

Follow-up: presigned URLs, multipart upload, retrying chunks, malware scanning,
and never trusting client-side validation.

## 5. Infinite list

- Cursor pagination.
- Intersection observer.
- Loading/error/retry.
- Request deduplication.
- Stable item identity.

Follow-up: virtualization, restoring scroll position, new items appearing above,
and an accessible non-infinite fallback.

## 6. Toast system

- Context plus reducer.
- Unique IDs and removal.
- Auto-dismiss cleanup.
- Pause dismissal on hover/focus.
- Accessible live-region behavior.

Follow-up: deduplication, maximum visible toasts, actions, and what should not be
communicated only via a transient toast.

## 7. Undoable editable list

- Reducer with past/present/future state.
- Immutable transitions.
- Keyboard shortcuts.
- Bounded history.

Follow-up: integrating server persistence and conflicts.

## 8. External-store hook

Build a hook that subscribes to online/offline state or a tiny external store.
Explain why React needs a consistent subscribe/get-snapshot contract and how it
differs from reading a mutable global during render.

---

# Rapid-fire question checklist

You should be able to answer each in under 90 seconds:

- What is React reconciliation?
- What is state as a snapshot?
- Why should rendering be pure?
- What triggers a render?
- Does a render always update the DOM?
- Why do state updates need functional updater syntax sometimes?
- What does batching do?
- Why are stable keys important?
- When does React preserve or reset state?
- Controlled versus uncontrolled components?
- When should state be lifted?
- When is a value derived rather than stored?
- Why is direct state mutation dangerous?
- What are the rules of hooks?
- What is a stale closure?
- What is an effect for?
- When do you not need an effect?
- What does effect cleanup do?
- Why can effects appear to run twice in development?
- Ref versus state?
- `useReducer` versus `useState`?
- Context versus props?
- When is Redux useful, and when is local state simpler?
- What roles do actions, reducers, dispatch, and selectors play?
- What makes a good custom hook?
- `React.memo` versus `useMemo` versus `useCallback`?
- How do you diagnose unnecessary renders?
- How do you prevent async request races?
- How do error boundaries differ from request error handling?
- How do portals affect DOM placement and React event propagation?
- What would you test in an interactive component?
- How do you make a dialog or combobox accessible?
- CSR versus SSR?
- What is hydration?
- What belongs in URL state?
- UI state versus server state?
- How do optimistic updates fail safely?
- How do CORS, CSRF, and XSS differ?

---

# Final readiness rubric

Score each dimension from 0 to 3:

- **0 — Cannot explain:** The topic is unfamiliar.
- **1 — Recognition:** Can define terms but cannot reliably predict behavior.
- **2 — Working:** Can implement and diagnose normal cases with minor gaps.
- **3 — Interview-ready:** Can explain the model, implement it, cover failure
  modes, and discuss alternatives.

Dimensions:

| Dimension | Target |
| --- | ---: |
| Render/commit/state snapshot mental model | 3 |
| State shape, immutability, and keys | 3 |
| Hooks, closures, effects, and cleanup | 3 |
| Forms and accessible interactions | 2–3 |
| Async requests and server state | 3 |
| Component API and state ownership | 2–3 |
| Performance diagnosis | 2 |
| Behavior-focused testing | 2–3 |
| Browser security and networking | 2–3 |
| Rendering strategies and system design | 2 |

You are ready when you can complete two different 45-minute exercises without
major hook or state-model mistakes, diagnose at least 12 of the 15 gotchas aloud,
and lead the dashboard system-design discussion without turning every concern
into global state or a client-side effect.

## High-value official references

- [Thinking in React](https://react.dev/learn/thinking-in-react)
- [State as a Snapshot](https://react.dev/learn/state-as-a-snapshot)
- [Queueing a Series of State Updates](https://react.dev/learn/queueing-a-series-of-state-updates)
- [Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure)
- [Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state)
- [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [Lifecycle of Reactive Effects](https://react.dev/learn/lifecycle-of-reactive-effects)
- [`useRef`](https://react.dev/reference/react/useRef)
- [`StrictMode`](https://react.dev/reference/react/StrictMode)
- [React TypeScript guide](https://react.dev/learn/typescript)
- [Redux Toolkit quick start](https://redux-toolkit.js.org/tutorials/quick-start)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN web platform documentation](https://developer.mozilla.org/)
