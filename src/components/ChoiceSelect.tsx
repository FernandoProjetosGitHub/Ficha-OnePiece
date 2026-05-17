type ChoiceOption = {
  value: string
  label: string
  detail?: string
}

type ChoiceSelectProps = {
  label: string
  value: string
  options: ChoiceOption[]
  onChange: (value: string) => void
  disabled?: boolean
  helper?: string
}

// Seletor unico para escolhas grandes: economiza espaco no mobile e evita carrosseis de botoes.
export function ChoiceSelect({ label, value, options, onChange, disabled, helper }: ChoiceSelectProps) {
  const selected = options.find((option) => option.value === value)

  return (
    <label className="choice-select">
      <span>{label}</span>
      <select disabled={disabled} onChange={(event) => onChange(event.target.value)} value={value}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {(selected?.detail || helper) && (
        <small>{selected?.detail ?? helper}</small>
      )}
    </label>
  )
}

type MultiChoiceSelectProps = {
  label: string
  values: string[]
  options: ChoiceOption[]
  onChange: (values: string[]) => void
  disabled?: boolean
  helper?: string
}

// Multi-select nativo: mantem todas as opcoes em um unico controle e aceita desmarcar sem logica escondida.
export function MultiChoiceSelect({ label, values, options, onChange, disabled, helper }: MultiChoiceSelectProps) {
  return (
    <label className="choice-select multi-choice">
      <span>{label}</span>
      <select
        disabled={disabled}
        multiple
        onChange={(event) => {
          const nextValues = Array.from(event.currentTarget.selectedOptions, (option) => option.value)
          onChange(nextValues)
        }}
        value={values}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helper && <small>{helper}</small>}
    </label>
  )
}
