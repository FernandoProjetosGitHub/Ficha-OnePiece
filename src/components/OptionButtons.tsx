type Option = {
  value: string
  label: string
  detail?: string
}

type OptionButtonsProps = {
  label: string
  value: string
  options: Option[]
  onChange: (value: string) => void
  disabled?: boolean
}

// Botões segmentados substituem selects nativos nas escolhas centrais da ficha.
export function OptionButtons({ label, value, options, onChange, disabled }: OptionButtonsProps) {
  return (
    <section className="option-group" aria-label={label}>
      <span>{label}</span>
      <div className="option-buttons">
        {options.map((option) => (
          <button
            className={option.value === value ? 'option-button active' : 'option-button'}
            disabled={disabled}
            key={option.value}
            onClick={() => onChange(option.value)}
            type="button"
          >
            <strong>{option.label}</strong>
            {option.detail && <small>{option.detail}</small>}
          </button>
        ))}
      </div>
    </section>
  )
}

type MultiOptionButtonsProps = {
  label: string
  values: string[]
  options: Option[]
  onToggle: (value: string) => void
  disabled?: boolean
}

export function MultiOptionButtons({ label, values, options, onToggle, disabled }: MultiOptionButtonsProps) {
  return (
    <section className="option-group" aria-label={label}>
      <span>{label}</span>
      <div className="option-buttons">
        {options.map((option) => {
          const active = values.includes(option.value)
          return (
            <button
              aria-pressed={active}
              className={active ? 'option-button active' : 'option-button'}
              disabled={disabled}
              key={option.value}
              onClick={() => onToggle(option.value)}
              type="button"
            >
              <strong>{option.label}</strong>
              {option.detail && <small>{option.detail}</small>}
            </button>
          )
        })}
      </div>
    </section>
  )
}
