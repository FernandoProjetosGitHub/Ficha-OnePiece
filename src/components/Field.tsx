import type { ComponentProps } from 'react'

type FieldProps = ComponentProps<'input'> & {
  label: string
}

// Campo pequeno e reutilizável para manter a ficha consistente no mobile.
export function Field({ label, ...props }: FieldProps) {
  return (
    <label className="field">
      <span>{label}</span>
      <input {...props} />
    </label>
  )
}

type SelectFieldProps = ComponentProps<'select'> & {
  label: string
  options: Array<string | { value: string; label: string }>
}

export function SelectField({ label, options, ...props }: SelectFieldProps) {
  return (
    <label className="field">
      <span>{label}</span>
      <select {...props}>
        {options.map((option) => (
          <option key={typeof option === 'string' ? option : option.value} value={typeof option === 'string' ? option : option.value}>
            {typeof option === 'string' ? option : option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

type TextAreaFieldProps = ComponentProps<'textarea'> & {
  label: string
}

export function TextAreaField({ label, ...props }: TextAreaFieldProps) {
  return (
    <label className="field field-wide">
      <span>{label}</span>
      <textarea {...props} />
    </label>
  )
}
