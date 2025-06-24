import { useId, type FormEvent } from 'react'
import clsx from 'clsx/lite'

interface Props {
  className?: string
  type?: 'text' | 'password' | 'url' | 'number' | 'email' | 'date'
  label?: string
  name?: string
  value?: string
  defaultValue?: string
  placeholder?: string
  error?: string
  required?: boolean
  readonly?: boolean
  onInput?: (event: FormEvent<HTMLInputElement>) => void
}

export default function Input({
  className,
  type,
  label,
  name,
  value,
  defaultValue,
  placeholder,
  error,
  required,
  readonly,
  onInput
}: Props) {
  const id = useId()

  return (
    <div className={clsx('relative', className)}>
      {label && (
        <label
          className={clsx(
            'mb-0.5 mx-5 w-fit block font-display text-blue-950',
            type === 'date' ? 'text-xs' : 'text-sm'
          )}
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <input
        className={clsx(
          'w-full py-3 px-5 rounded-4xl font-display text-sm outline-1',
          error ? 'outline-red-600' : 'outline-blue-950',
          '-outline-offset-1 focus:outline-2 focus:-outline-offset-2',
          'focus:outline-purple-900'
        )}
        type={type || 'text'}
        name={name}
        id={id}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        readOnly={readonly}
        disabled={readonly}
        onInput={onInput}
      />
      {required && <span className="absolute text-sm text-blue-950">*</span>}
      {error && (
        <p className="mt-0.5 mx-5 font-light text-right text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
