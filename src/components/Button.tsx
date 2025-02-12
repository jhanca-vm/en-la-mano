import type { ComponentChildren } from 'preact'
import clsx from 'clsx/lite'

interface Props {
  class?: string
  disabled?: boolean
  loading?: boolean
  onClick?: () => void | Promise<void>
  children: ComponentChildren
}

export default function Button({
  class: className,
  disabled,
  loading,
  onClick,
  children
}: Props) {
  return (
    <button
      class={clsx(
        className,
        'group py-2 px-5 rounded-full bg-orange-500 text-neutral-100',
        'hover:bg-orange-500/90 disabled:bg-orange-500/neutral-100',
        'focus-visible:outline-2 focus-visible:outline-offset-2',
        'focus-visible:outline-blue-900'
      )}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 fill-none stroke-current stroke-2 animate-spin"
          viewBox="0 0 24 24"
          stroke-linecap="round"
        >
          <path d="M12 3a9 9 0 1 0 9 9" />
        </svg>
      ) : (
        children
      )}
    </button>
  )
}
