import clsx from 'clsx/lite'
import set from 'just-safe-set'
import get from 'just-safe-get'
import debounce from 'just-debounce-it'
import { json, state } from '@/store'

interface Props {
  class?: string
  label?: string
  name?: string
  target?: string
  placeholder?: string
  value?: string
  required?: boolean
  fixed?: boolean
  onInput?: (event: InputEvent) => void
}

export default function Textarea({
  class: className,
  label,
  name,
  target,
  placeholder,
  value,
  required,
  fixed,
  onInput
}: Props) {
  function handleInput(event: InputEvent) {
    if (target) {
      const eventTarget = event.target as HTMLTextAreaElement
      const data = JSON.parse(json.value)

      set(data, target, eventTarget.value)

      json.value = JSON.stringify(data)
    }
  }

  return (
    <div class={className}>
      {label && (
        <label
          class="mb-0.5 mx-5 w-fit block font-display text-sm"
          for={name || target}
        >
          {label}
        </label>
      )}
      <textarea
        class={clsx(
          'w-full py-2 px-5 rounded-[1.25rem] font-display text-sm',
          !fixed && 'field-sizing-content',
          'resize-none outline-1 -outline-offset-1',
          'outline-blue-950 placeholder:text-neutral-400 focus:outline-2',
          'focus:-outline-offset-2 focus:outline-orange-500'
        )}
        rows={4}
        name={name}
        id={name || target}
        value={value || (target ? get(state.value, target) : undefined)}
        placeholder={placeholder}
        required={required}
        onInput={
          target || onInput ? debounce(onInput || handleInput, 500) : undefined
        }
      ></textarea>
    </div>
  )
}
