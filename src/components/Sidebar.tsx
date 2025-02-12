import { useSignal } from '@preact/signals'
import clsx from 'clsx/lite'
import IconMenu from './IconMenu'

interface Props {
  pathname: string
}

export default function Sidebar({ pathname }: Props) {
  const isOpen = useSignal(false)
  const links = [
    { href: '/admin', label: 'En La Mano' },
    { href: '/admin/landings', label: 'Landings' }
  ]

  function handleClick({ target, currentTarget }: MouseEvent) {
    if (target === currentTarget) isOpen.value = false
  }

  return (
    <>
      <button
        class="absolute left-3.5 top-5 md:hidden"
        onClick={() => (isOpen.value = true)}
      >
        <IconMenu />
      </button>
      <aside
        class={clsx(
          !isOpen.value && 'hidden',
          'fixed inset-0 z-10 h-lvh bg-black/50 md:sticky md:block'
        )}
        onClick={handleClick}
      >
        <nav
          class={
            'w-64 h-full p-4 flex flex-col gap-2 bg-blue-950 text-neutral-100'
          }
        >
          {links.map(({ label, href }) => (
            <a
              class={clsx(
                'px-4 py-2 rounded-md',
                pathname === href
                  ? 'bg-purple-900'
                  : 'text-neutral-400 hover:bg-purple-900/30'
              )}
              href={href}
            >
              {label}
            </a>
          ))}
        </nav>
      </aside>
    </>
  )
}
