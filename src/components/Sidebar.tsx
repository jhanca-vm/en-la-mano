import { useState } from 'react'
import { navigate } from 'astro:transitions/client'
import clsx from 'clsx/lite'
import IconMenu from './icons/Menu'
import ChangePassword from './ChangePassword'
import Button from './Button'

interface Props {
  pathname: string
  username?: string
}

const links = [
  { href: '/admin', label: 'En La Mano' },
  { href: '/admin/leads', label: 'Leads Generados' },
  { href: '/admin/reclamos', label: 'Reclamos' },
  { href: '/admin/landings', label: 'Landings' },
  { href: '/admin/quienes-somos', label: 'Quiénes Somos' },
  { href: '/admin/preguntas-frecuentes', label: 'Preguntas Frecuentes' },
  { href: '/admin/terminos-y-condiciones', label: 'Términos y Condiciones' },
  {
    href: '/admin/politicas-de-privacidad',
    label: 'Políticas de Privacidad'
  },
  { href: '/admin/politicas-de-seguridad', label: 'Políticas de Seguridad' },
  {
    href: '/admin/bases-y-condiciones-de-sorteos',
    label: 'Bases y Condiciones de Sorteos'
  }
]

export default function Sidebar({ pathname, username }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        className="absolute left-3.5 top-5.5 md:hidden"
        onClick={() => setIsOpen(true)}
      >
        <IconMenu />
      </button>
      <aside
        className={clsx(
          !isOpen && 'hidden',
          'fixed inset-0 z-10 h-lvh bg-black/50 md:sticky md:block'
        )}
        onClick={(event) => {
          if (event.target === event.currentTarget) setIsOpen(false)
        }}
      >
        <nav
          className={
            'w-64 h-full p-4 flex flex-col gap-2 bg-blue-950 text-neutral-100'
          }
        >
          {links.map(({ label, href }) => (
            <a
              className={clsx(
                'px-4 py-2 rounded-md',
                pathname === href
                  ? 'bg-purple-900'
                  : 'text-neutral-400 hover:bg-purple-900/30'
              )}
              href={href}
              key={href}
            >
              {label}
            </a>
          ))}
          <div className="mt-auto pt-5 flex flex-col items-start gap-2">
            <ChangePassword username={username} />
            <Button
              onClick={async () => {
                document.cookie = 'token=; max-age=0;'
                await navigate('/login')
              }}
            >
              Cerrar Sesión
            </Button>
          </div>
        </nav>
      </aside>
    </>
  )
}
