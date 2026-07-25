import type { ProblemDefinition } from './problemDefinitions'

type ProblemPageProps = {
  problem: ProblemDefinition
}

export function ProblemPage({ problem }: ProblemPageProps) {
  const { Solution } = problem
  const titleId = `problem-${problem.number}-title`

  return (
    <article className="problem-page" aria-labelledby={titleId}>
      <header className="problem-header">
        <div className="problem-header__meta">
          <span>Problem {problem.number.toString().padStart(2, '0')}</span>
          <span aria-hidden="true">•</span>
          <span>{problem.duration}</span>
        </div>
        <h1 id={titleId}>{problem.title}</h1>
        {problem.description.map((paragraph) => (
          <p className="problem-header__lead" key={paragraph}>
            {paragraph}
          </p>
        ))}
        {problem.steps && (
          <ol className="problem-steps">
            {problem.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        )}
      </header>

      <section className="problem-section" aria-labelledby="starting-point">
        <div className="section-heading">
          <span className="section-heading__number">01</span>
          <h2 id="starting-point">Starting point</h2>
        </div>
        <figure className="code-block">
          <figcaption>{problem.codeIntro}</figcaption>
          <pre>
            <code>{problem.code}</code>
          </pre>
        </figure>
      </section>

      <section className="problem-section" aria-labelledby="requirements">
        <div className="section-heading">
          <span className="section-heading__number">02</span>
          <h2 id="requirements">Requirements</h2>
        </div>
        <ul className="requirements-list">
          {problem.requirements.map((requirement) => (
            <li key={requirement}>{requirement}</li>
          ))}
        </ul>
        {problem.constraint && (
          <aside className="constraint-callout">
            <strong>Constraint</strong>
            <p>{problem.constraint}</p>
          </aside>
        )}
      </section>

      <section className="problem-section" aria-labelledby="discussion">
        <div className="section-heading">
          <span className="section-heading__number">03</span>
          <h2 id="discussion">Follow-up discussion</h2>
        </div>
        <ol className="discussion-list">
          {problem.followUps.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ol>
      </section>

      <section className="problem-section solution-section" aria-labelledby="solution">
        <div className="section-heading">
          <span className="section-heading__number">04</span>
          <h2 id="solution">Solution workspace</h2>
        </div>
        <div className="solution-file">
          <span>Component file</span>
          <code>{problem.solutionPath}</code>
        </div>
        <div className="solution-mount">
          <Solution />
        </div>
      </section>
    </article>
  )
}
