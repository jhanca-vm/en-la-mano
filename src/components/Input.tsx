import set from 'just-safe-set'
import clsx from 'clsx/lite'
import get from 'just-safe-get'
import debounce from 'just-debounce-it'
import { json, state } from '@/store'

interface Props {
  class?: string
  type?: 'text' | 'password' | 'url' | 'number' | 'email' | 'date'
  label?: string
  name?: string
  target?: string
  placeholder?: string
  value?: string
  required?: boolean
  readonly?: boolean
  onInput?: (event: InputEvent) => void
}

export default function Input({
  class: className,
  type,
  label,
  name,
  target,
  placeholder,
  value,
  required,
  readonly,
  onInput
}: Props) {
  function handleInput(event: InputEvent) {
    if (target) {
      const eventTarget = event.target as HTMLInputElement
      const data = JSON.parse(json.value)

      set(data, target, eventTarget.value)

      json.value = JSON.stringify(data)
    }
  }

  return (
    <div class={className}>
      {label && (
        <label
          class={clsx(
            'mb-0.5 mx-5 w-fit block font-display text-blue-950',
            type === 'date' ? 'text-xs' : 'text-sm'
          )}
          for={name || target}
        >
          {label}
        </label>
      )}
      <input
        class={clsx(
          'w-full py-3 px-5 rounded-4xl font-display text-sm outline-1',
          '-outline-offset-1 outline-blue-950 placeholder:text-neutral-400',
          'focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500'
        )}
        type={type || 'text'}
        name={name}
        id={name || target}
        value={value || (target ? get(state.value, target) : undefined)}
        placeholder={placeholder}
        required={required}
        readonly={readonly}
        disabled={readonly}
        onInput={target ? debounce(handleInput, 500) : onInput}
      />
    </div>
  )
}
