import { useSignal } from '@preact/signals'
import clsx from 'clsx/lite'
import IconMenu from './IconMenu'

interface Props {
  pathname: string
}

export default function Nav({ pathname }: Props) {
  const isOpen = useSignal(false)
  const links = [
    { href: '/', label: 'Inicio' },
    { href: '/quienes-somos', label: 'Quiénes somos' },
    { href: '/preguntas-frecuentes', label: 'Preguntas frecuentes' },
    { href: '/contacto', label: 'Contacto' }
  ]

  function handleClick({ target, currentTarget }: MouseEvent) {
    if (target === currentTarget) isOpen.value = false
  }

  return (
    <>
      <button
        class="order-first lg:hidden"
        aria-label="Abrir menú"
        aria-expanded={isOpen ? 'true' : 'false'}
        aria-controls="menu"
        onClick={() => (isOpen.value = true)}
      >
        <IconMenu />
      </button>
      <nav
        class={clsx(
          !isOpen.value && 'hidden',
          'fixed inset-0 z-10 h-screen bg-black/50 lg:static lg:h-auto',
          'lg:block lg:bg-transparent'
        )}
        id="menu"
        onClick={handleClick}
      >
        <ul
          class={clsx(
            'w-fit h-full p-5 flex flex-col gap-y-4 gap-x-8 bg-neutral-100',
            'text-blue-900 lg:p-0 lg:flex-row lg:bg-inherit lg:text-inherit'
          )}
        >
          {links.map(({ href, label }) => (
            <li>
              <a
                class={
                  pathname === href
                    ? 'font-semibold text-orange-500'
                    : 'hover:opacity-90'
                }
                href={href}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
