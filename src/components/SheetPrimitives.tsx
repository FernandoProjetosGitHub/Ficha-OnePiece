import { ChevronRight } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'

type PanelProps = {
  title: string
  icon: ReactNode
  children: ReactNode
  className?: string
  id?: string
}

// Painel base da ficha: centraliza cabecalho, icone e espacamento de cada bloco.
export function Panel({ title, icon, children, className = '', id }: PanelProps) {
  return (
    <section className={`panel ${className}`} id={id}>
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

type ResourceMeterProps = {
  label: string
  value: string
  hint: string
  percent: number
  tone?: 'sea' | 'gold' | 'red'
}

export function ResourceMeter({ label, value, hint, percent, tone = 'sea' }: ResourceMeterProps) {
  const boundedPercent = Math.min(100, Math.max(0, percent))

  return (
    <article className="resource-meter" data-tone={tone}>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div
        aria-label={`${label}: ${Math.round(boundedPercent)}%`}
        className="meter-track"
        role="meter"
        style={{ '--meter-value': `${boundedPercent}%` } as CSSProperties}
      >
        <span />
      </div>
      <small>{hint}</small>
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
