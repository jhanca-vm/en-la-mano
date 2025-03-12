import { useId, type FormEvent } from 'react'
import clsx from 'clsx/lite'

interface Props {
  className?: string
  label?: string
  name?: string
  value?: string
  defaultValue?: string
  rows?: number
  placeholder?: string
  required?: boolean
  onInput?: (event: FormEvent<HTMLTextAreaElement>) => void
}

export default function Textarea({
  className,
  label,
  name,
  value,
  defaultValue,
  rows,
  placeholder,
  required,
  onInput
}: Props) {
  const id = useId()

  return (
    <div className={clsx('relative', className)}>
      {label && (
        <label
          className="mb-0.5 mx-5 w-fit block font-display text-sm"
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <textarea
        className={clsx(
          'w-full py-2 px-5 rounded-[1.25rem] font-display text-sm',
          !rows && 'field-sizing-content',
          'resize-none outline-1 -outline-offset-1',
          'outline-blue-950 placeholder:text-neutral-400 focus:outline-2',
          'focus:-outline-offset-2 focus:outline-orange-500'
        )}
        name={name}
        id={id}
        value={value}
        defaultValue={defaultValue}
        rows={rows}
        placeholder={placeholder}
        required={required}
        onInput={onInput}
      ></textarea>
      {required && <span className="absolute text-sm text-blue-950">*</span>}
    </div>
  )
}
