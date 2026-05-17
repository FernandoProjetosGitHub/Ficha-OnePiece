import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'

type PanelProps = {
  title: string
  icon: ReactNode
  children: ReactNode
  className?: string
}

// Painel base da ficha: centraliza cabecalho, icone e espacamento de cada bloco.
export function Panel({ title, icon, children, className = '' }: PanelProps) {
  return (
    <section className={`panel ${className}`}>
      <h2>{icon}<span>{title}</span></h2>
      {children}
    </section>
  )
}

export function Stat({ icon, label, value, hint }: { icon: ReactNode; label: string; value: ReactNode; hint: string }) {
  return (
    <article className="stat">
      <span className="stat-icon">{icon}</span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
        <span>{hint}</span>
      </div>
    </article>
  )
}

export function MiniCalc({ label, value }: { label: string; value: ReactNode }) {
  return (
    <article className="mini-calc">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  )
}

export function InfoList({ items }: { items: string[] }) {
  return (
    <ul className="info-list">
      {items.map((item) => (
        <li key={item}><ChevronRight size={15} />{item}</li>
      ))}
    </ul>
  )
}

type ExpandableInfoItem = {
  name: string
  detail: string
  bullets?: string[]
}

export function ExpandableInfoList({ items }: { items: ExpandableInfoItem[] }) {
  return (
    <div className="nested-detail-list">
      {items.map((item) => (
        <details className="nested-detail" key={item.name}>
          <summary>{item.name}</summary>
          <p>{item.detail}</p>
          {item.bullets && <InfoList items={item.bullets} />}
        </details>
      ))}
    </div>
  )
}
