import { useId, useState } from 'react'
import clsx from 'clsx/lite'
import IconMenu from './icons/Menu'

interface Props {
  pathname: string
  isLanding: boolean
}

const links = [
  { href: '/', label: 'Inicio' },
  { href: '/quienes-somos', label: 'Quiénes somos' },
  { href: '/preguntas-frecuentes', label: 'Preguntas frecuentes' },
  { href: '/contacto', label: 'Contacto' }
]

export default function Nav({ pathname, isLanding }: Props) {
  const id = useId()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        className="order-first lg:hidden"
        aria-label="Abrir menú"
        aria-expanded={isOpen ? 'true' : 'false'}
        aria-controls="menu"
        onClick={() => setIsOpen(true)}
      >
        <IconMenu />
      </button>
      <nav
        className={clsx(
          !isOpen && 'hidden',
          'fixed inset-0 z-10 h-screen bg-black/50 lg:static lg:h-auto',
          'lg:block lg:bg-transparent'
        )}
        id={id}
        onClick={(event) => {
          if (event.target === event.currentTarget) setIsOpen(false)
        }}
      >
        <ul
          className={clsx(
            'w-fit h-full p-5 flex flex-col gap-y-4 gap-x-8 bg-neutral-100',
            'text-blue-900 lg:p-0 lg:flex-row lg:bg-inherit lg:text-inherit'
          )}
        >
          {links.map(({ href, label }) => (
            <li key={href}>
              <a
                className={
                  pathname === href
                    ? 'font-medium text-orange-500'
                    : isLanding
                      ? 'hover:text-purple-900'
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
