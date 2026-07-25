type EmptySolutionProps = {
  name: string
}

export function EmptySolution({ name }: EmptySolutionProps) {
  return (
    <div className="empty-solution">
      <span className="empty-solution__label">Empty component</span>
      <h3>{name} is ready for your solution</h3>
      <p>Replace this placeholder as you work through the requirements above.</p>
    </div>
  )
}
