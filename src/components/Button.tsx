import type { MouseEvent, ReactNode, Ref } from 'react'
import { useFormStatus } from 'react-dom'
import clsx from 'clsx/lite'

interface Props {
  ref?: Ref<HTMLButtonElement>
  className?: string
  type?: 'submit' | 'reset' | 'button'
  disabled?: boolean
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  children: ReactNode
}

export default function Button({
  ref,
  className,
  type,
  disabled,
  onClick,
  children
}: Props) {
  const { pending } = useFormStatus()

  return (
    <button
      ref={ref}
      className={clsx(
        className,
        'group py-1.5 px-5 rounded-full bg-orange-500 text-neutral-100',
        'hover:bg-orange-500/90 disabled:bg-orange-500/neutral-100',
        'focus-visible:outline-2 focus-visible:outline-offset-2',
        'focus-visible:outline-blue-900'
      )}
      type={type}
      disabled={disabled || pending}
      onClick={onClick}
    >
      {pending ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 fill-none stroke-current stroke-2 animate-spin"
          viewBox="0 0 24 24"
          strokeLinecap="round"
        >
          <path d="M12 3a9 9 0 1 0 9 9" />
        </svg>
      ) : (
        children
      )}
    </button>
  )
}
