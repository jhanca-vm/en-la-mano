import type { ChangeEvent, ReactNode } from 'react'
import clsx from 'clsx/lite'

interface Props {
  className?: string
  name?: string
  value: string
  required?: boolean
  disabled?: boolean
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void
  children: ReactNode
}

export default function Select({
  className,
  name,
  value,
  required,
  disabled,
  onChange,
  children
}: Props) {
  return (
    <div className="relative">
      <select
        className={clsx(
          className,
          'appearance-none w-full px-5 py-3 rounded-4xl font-display text-sm',
          value ? 'text-blue-950' : 'text-neutral-400',
          'outline-1 -outline-offset-1 outline-blue-950 active:text-blue-950',
          'active:outline-2 active:-outline-offset-2 active:outline-orange-500',
          'disabled:outline-1 disabled:-outline-offset-1',
          'disabled:outline-neutral-400 disabled:text-neutral-400'
        )}
        name={name}
        value={value}
        required={required}
        disabled={disabled}
        onChange={onChange}
      >
        {children}
      </select>
      {required && <span className="absolute text-sm text-blue-950">*</span>}
    </div>
  )
}
