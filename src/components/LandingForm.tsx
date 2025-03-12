import { useId, useState, type ReactNode } from 'react'
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
  const [errors, setErrors] = useState<(string | undefined)[]>([])

  async function handleRequest() {
    if (!validateCI(docNumber)) {
      setErrors(['La cédula ingresada no es válida'])
    } else if (
      mobilephone.length !== 9 ||
      [...mobilephone].some((d) => isNaN(Number(d)))
    ) {
      setErrors([undefined, 'El celular ingresado no es válido'])
    } else {
      const result = await actions.sendRequest({
        script: 36,
        data: { docNumber, mobilephone, source }
      })

      if (!result.error) await navigate(result.data!, { history: 'replace' })
    }
  }

  return (
    <>
      <form
        className={clsx(
          'relative h-121.5 max-w-84 mx-auto p-8 flex flex-col justify-between',
          'rounded-3xl bg-neutral-100',
          'text-blue-900 [&_strong]:font-extrabold [&_strong]:text-4xl/none',
          '[&_strong]:tracking-wide sm:mr-5 md:mr-10 xl:mr-15'
        )}
        action={handleRequest}
      >
        <div>
          <p className="mb-4 leading-none">Solicitá efectivo</p>
          {children}
        </div>
        <div>
          <Input
            className="mt-9"
            type="number"
            placeholder="Cédula (sin puntos ni guiones)"
            value={docNumber}
            error={errors[0]}
            onInput={({ currentTarget: { value } }) => {
              if (value.length <= 8) {
                setDocNumber(value)
                setErrors([])
              }
            }}
          />
          <Input
            className="mt-2.5"
            type="number"
            placeholder="Celular"
            value={mobilephone}
            error={errors[1]}
            onInput={({ currentTarget: { value } }) => {
              if (value.length <= 9) {
                setMobilephone(value)
                setErrors([])
              }
            }}
          />
        </div>
        <div>
          <div
            className={
              'mt-5 mb-9 grid grid-cols-[max-content_1fr] items-start gap-2'
            }
          >
            <input
              className={clsx(
                'appearance-none mt-0.5 size-3 rounded-sm border bg-contain',
                'border-blue-950 checked:bg-[url(/icons/check.svg)]'
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
                Políticas de Privacidad
              </a>
            </label>
          </div>
          <Button className="flex items-center">
            Solicitar efectivo <IconArrow />
          </Button>
        </div>
      </form>
    </>
  )
}
