import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { useAppDispatch, useAppSelector } from './app/hooks'
import {
  addEnthusiasm,
  resetGreeting,
} from './features/greeting/greetingSlice'

export function PlaygroundPage() {
  const dispatch = useAppDispatch()
  const { message, enthusiasm } = useAppSelector((state) => state.greeting)

  return (
    <article className="playground-page" aria-labelledby="playground-title">
      <header className="playground-header">
        <div className="problem-header__meta">
          <span>Playground</span>
          <span aria-hidden="true">•</span>
          <span>Redux Toolkit primer</span>
        </div>
        <h1 id="playground-title">Learn by changing one thing at a time.</h1>
        <p>
          This is a safe scratch space for exploring the app before you start
          an interview problem.
        </p>
      </header>

      <section className="redux-demo" aria-labelledby="redux-demo-title">
        <div className="redux-demo__visual" aria-hidden="true">
          <div className="hero">
            <img src={heroImg} className="base" width="170" height="179" alt="" />
            <img src={reactLogo} className="framework" alt="" />
            <img src={viteLogo} className="vite" alt="" />
          </div>
        </div>
        <div className="redux-demo__content">
          <span className="eyebrow">Store-powered greeting</span>
          <h2 id="redux-demo-title" aria-live="polite">
            {message}
            {'!'.repeat(enthusiasm)}
          </h2>
          <p>
            The component selects this greeting from the store. Each click
            dispatches an action, runs the slice reducer, and renders the
            selected value again.
          </p>
          <div className="greeting-actions">
            <button
              type="button"
              className="primary-button"
              onClick={() => dispatch(addEnthusiasm())}
            >
              Dispatch addEnthusiasm
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() => dispatch(resetGreeting())}
            >
              Reset
            </button>
          </div>
        </div>
      </section>

      <section className="playground-notes" aria-labelledby="playground-files">
        <div>
          <span className="eyebrow">Follow the data</span>
          <h2 id="playground-files">Four small files, one complete flow</h2>
          <p>
            Start with the component, then trace the hooks, store, and slice to
            see how React Redux connects the UI to an external store.
          </p>
        </div>
        <ol className="file-list">
          <li>
            <span>01</span>
            <code>src/PlaygroundPage.tsx</code>
          </li>
          <li>
            <span>02</span>
            <code>src/app/hooks.ts</code>
          </li>
          <li>
            <span>03</span>
            <code>src/app/store.ts</code>
          </li>
          <li>
            <span>04</span>
            <code>src/features/greeting/greetingSlice.ts</code>
          </li>
        </ol>
      </section>
    </article>
  )
}
