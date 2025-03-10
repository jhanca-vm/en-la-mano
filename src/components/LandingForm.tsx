import { useId, useState, type ReactNode } from 'react'
import { Toaster, toast } from 'sonner'
import { actions } from 'astro:actions'
import { navigate } from 'astro:transitions/client'
import clsx from 'clsx/lite'
import validateCI from '@/lib/validateCI'
import IconArrow from './icons/Arrow'
import Input from './Input'
import Button from './Button'

interface Props {
  source: string
  children: ReactNode
}

export default function LandingForm({ source, children }: Props) {
  const id = useId()
  const [docNumber, setDocNumber] = useState('')
  const [mobilephone, setMobilephone] = useState('')

  async function handleRequest() {
    if (!validateCI(docNumber)) {
      toast.error('El número de cédula ingresado no es válido')
    } else if (
      mobilephone.length !== 9 ||
      [...mobilephone].some((d) => isNaN(Number(d)))
    ) {
      toast.error('El número de celular ingresado no es válido')
    } else {
      const result = await actions.sendRequest({
        script: 36,
        data: { docNumber, mobilephone, source }
      })

      result.error
        ? toast.error('Ha ocurrido un error, intente más tarde')
        : await navigate(result.data!, { history: 'replace' })
    }
  }

  return (
    <>
      <form
        className={clsx(
          'relative max-w-84 mx-auto p-8 rounded-3xl bg-neutral-100',
          'text-blue-900 [&_strong]:font-extrabold [&_strong]:text-4xl/none',
          '[&_strong]:tracking-wide sm:mr-5 md:mr-10 xl:mr-15'
        )}
        action={handleRequest}
      >
        <p className="mb-4 leading-none">Solicitá efectivo</p>
        {children}
        <Input
          className="mt-10"
          type="number"
          placeholder="Cédula (sin puntos ni guiones)"
          value={docNumber}
          onInput={({ currentTarget: { value } }) => {
            if (value.length <= 8) setDocNumber(value)
          }}
        />
        <Input
          className="mt-2.5"
          type="number"
          placeholder="Celular"
          value={mobilephone}
          onInput={({ currentTarget: { value } }) => {
            if (value.length <= 9) setMobilephone(value)
          }}
        />{' '}
        <div
          className={
            'mt-5 mb-8 grid grid-cols-[max-content_1fr] items-start gap-2'
          }
        >
          <input
            className={clsx(
              'appearance-none mt-0.5 size-3 rounded-sm border border-blue-950',
              'bg-contain checked:bg-[url(/icons/check.svg)]'
            )}
            type="checkbox"
            id={id}
            required
          />
          <label className="font-display text-xs" htmlFor={id}>
            Leí y acepto los{' '}
            <a
              className="font-medium underline hover:text-purple-900"
              href="/terminos-y-condiciones"
              target="_blank"
            >
              Términos y Condiciones
            </a>{' '}
            y{' '}
            <a
              className="font-medium underline hover:text-purple-900"
              href="/politicas-de-privacidad"
              target="_blank"
            >
              Políticas de Privacidad.
            </a>
          </label>
        </div>
        <Button className="flex items-center">
          Solicitar efectivo <IconArrow />
        </Button>
      </form>
      <Toaster position="bottom-left" richColors />
    </>
  )
}
