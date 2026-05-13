import type { ReactNode } from 'react'

type DetailsCardProps = {
  title: string
  eyebrow?: string
  children: ReactNode
  open?: boolean
}

// O HTML details/summary entrega expansão acessível sem lógica extra.
export function DetailsCard({ title, eyebrow, children, open }: DetailsCardProps) {
  return (
    <details className="details-card" open={open}>
      <summary>
        <span>
          {eyebrow && <small>{eyebrow}</small>}
          {title}
        </span>
      </summary>
      <div className="details-body">{children}</div>
    </details>
  )
}
