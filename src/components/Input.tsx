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
  required?: boolean
  readonly?: boolean
  onInput?: (event: FormEvent<HTMLInputElement>) => void
}

export default function Input({
  className,
  type,
  label,
  name,
  placeholder,
  value,
  defaultValue,
  required,
  readonly,
  onInput
}: Props) {
  const id = useId()

  return (
    <div className={className}>
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
          '-outline-offset-1 outline-blue-950 placeholder:text-neutral-400',
          'focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500'
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
    </div>
  )
}
