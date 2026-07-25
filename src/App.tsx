import { useCallback, useEffect, useRef, useState } from 'react'
import { PlaygroundPage } from './PlaygroundPage'
import { ProblemPage } from './problems/ProblemPage'
import {
  getProblemBySlug,
  problems,
  type ProblemDefinition,
} from './problems/problemDefinitions'
import './App.css'

const PLAYGROUND_HASH = '#/playground'
const PROBLEM_HASH_PREFIX = '#/problems/'

function getProblemFromHash(hash: string) {
  if (!hash.startsWith(PROBLEM_HASH_PREFIX)) return undefined
  return getProblemBySlug(hash.slice(PROBLEM_HASH_PREFIX.length))
}

function isPlaygroundHash(hash: string) {
  return hash === PLAYGROUND_HASH
}

function App() {
  const [activeProblem, setActiveProblem] = useState<
    ProblemDefinition | undefined
  >(() => getProblemFromHash(window.location.hash))
  const [drawerOpen, setDrawerOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const sidebarRef = useRef<HTMLElement>(null)

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false)
    window.requestAnimationFrame(() => menuButtonRef.current?.focus())
  }, [])

  useEffect(() => {
    function syncRoute() {
      const problem = getProblemFromHash(window.location.hash)

      if (!problem && !isPlaygroundHash(window.location.hash)) {
        window.history.replaceState(null, '', PLAYGROUND_HASH)
      }

      setActiveProblem(problem)
      setDrawerOpen(false)
      window.scrollTo({ top: 0, behavior: 'instant' })
    }

    syncRoute()
    window.addEventListener('hashchange', syncRoute)
    return () => window.removeEventListener('hashchange', syncRoute)
  }, [])

  useEffect(() => {
    if (!drawerOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeDrawer()
        return
      }

      if (event.key !== 'Tab' || !sidebarRef.current) return

      const focusableElements = Array.from(
        sidebarRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        ),
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements.at(-1)

      if (!firstElement || !lastElement) return

      if (
        event.shiftKey &&
        (document.activeElement === firstElement ||
          !sidebarRef.current.contains(document.activeElement))
      ) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeDrawer, drawerOpen])

  const activeHash = activeProblem
    ? `${PROBLEM_HASH_PREFIX}${activeProblem.slug}`
    : PLAYGROUND_HASH

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="mobile-header">
        <a className="mobile-brand" href={PLAYGROUND_HASH}>
          <span aria-hidden="true">R</span>
          React Interview Lab
        </a>
        <button
          ref={menuButtonRef}
          type="button"
          className="menu-button"
          aria-controls="app-sidebar"
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen(true)}
        >
          <span aria-hidden="true">☰</span>
          <span className="visually-hidden">Open navigation</span>
        </button>
      </header>

      <aside
        ref={sidebarRef}
        id="app-sidebar"
        className={`sidebar${drawerOpen ? ' sidebar--open' : ''}`}
        aria-label="Application sidebar"
        role={drawerOpen ? 'dialog' : undefined}
        aria-modal={drawerOpen ? true : undefined}
      >
        <div className="sidebar__header">
          <a className="brand" href={PLAYGROUND_HASH} onClick={closeDrawer}>
            <span className="brand__mark" aria-hidden="true">
              R
            </span>
            <span>
              <strong>React Interview</strong>
              <small>Practice Lab</small>
            </span>
          </a>
          <button
            ref={closeButtonRef}
            type="button"
            className="drawer-close"
            onClick={closeDrawer}
          >
            <span aria-hidden="true">×</span>
            <span className="visually-hidden">Close navigation</span>
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Interview problems">
          <p className="sidebar-nav__label">Workspace</p>
          <a
            className={activeHash === PLAYGROUND_HASH ? 'nav-link active' : 'nav-link'}
            href={PLAYGROUND_HASH}
            aria-current={
              activeHash === PLAYGROUND_HASH ? 'page' : undefined
            }
            onClick={closeDrawer}
          >
            <span className="nav-link__icon" aria-hidden="true">
              ✦
            </span>
            <span>
              <strong>Playground</strong>
              <small>Redux primer</small>
            </span>
          </a>

          <p className="sidebar-nav__label problem-label">
            Problems <span>{problems.length}</span>
          </p>
          <ol className="problem-nav">
            {problems.map((problem) => {
              const hash = `${PROBLEM_HASH_PREFIX}${problem.slug}`
              const isActive = hash === activeHash

              return (
                <li key={problem.slug}>
                  <a
                    className={isActive ? 'nav-link active' : 'nav-link'}
                    href={hash}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={closeDrawer}
                  >
                    <span className="nav-link__number" aria-hidden="true">
                      {problem.number.toString().padStart(2, '0')}
                    </span>
                    <span>
                      <strong>{problem.title}</strong>
                      <small>{problem.duration}</small>
                    </span>
                  </a>
                </li>
              )
            })}
          </ol>
        </nav>

        <div className="sidebar__footer">
          <span aria-hidden="true">⌘</span>
          <p>
            <strong>Practice deliberately</strong>
            <small>Explain every tradeoff aloud.</small>
          </p>
        </div>
      </aside>

      {drawerOpen && (
        <button
          type="button"
          className="drawer-backdrop"
          aria-label="Close navigation"
          onClick={closeDrawer}
        />
      )}

      <main
        id="main-content"
        className="main-content"
        inert={drawerOpen ? true : undefined}
      >
        {activeProblem ? (
          <ProblemPage problem={activeProblem} />
        ) : (
          <PlaygroundPage />
        )}
      </main>
    </div>
  )
}

export default App
