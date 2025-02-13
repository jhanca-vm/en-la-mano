import type { ComponentChildren } from 'preact'
import { useId } from 'preact/hooks'
import { useSignal } from '@preact/signals'
import { actions } from 'astro:actions'
import { navigate } from 'astro:transitions/client'
import clsx from 'clsx/lite'
import IconArrow from './icons/Arrow'
import Input from './Input'
import Button from './Button'

interface Props {
  source: string
  children: ComponentChildren
}

export default function LandingForm({ source, children }: Props) {
  const id = useId()
  const isLoading = useSignal(false)
  const docNumber = useSignal('')
  const phone = useSignal('')
  const isChecked = useSignal(false)

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault()

    isLoading.value = true

    const result = await actions.sendRequest({
      script: 36,
      data: { docNumber: docNumber.value, phone: phone.value, source }
    })

    result.error
      ? (isLoading.value = false)
      : navigate(result.data!, { history: 'replace' })
  }

  return (
    <form
      class={clsx(
        'relative max-w-84 mx-auto p-8 rounded-3xl bg-neutral-100',
        'text-blue-900 [&_strong]:font-extrabold [&_strong]:text-4xl/none',
        '[&_strong]:tracking-wide sm:mr-5 md:mr-10 xl:mr-15'
      )}
      onSubmit={handleSubmit}
    >
      <p class="mb-4 leading-none">Solicitá efectivo</p>
      {children}
      <Input
        class="mt-10"
        type="number"
        placeholder="Cédula (sin puntos ni guiones)"
        value={docNumber.value}
        required
        onInput={(event) => {
          const target = event.target as HTMLInputElement
          docNumber.value = target.value
        }}
      />
      <Input
        class="mt-2.5"
        type="number"
        placeholder="Celular"
        value={phone.value}
        required
        onInput={(event) => {
          const target = event.target as HTMLInputElement
          phone.value = target.value
        }}
      />
      <div class="mt-5 mb-8 grid grid-cols-[max-content_1fr] items-start gap-2">
        <input
          class={clsx(
            'appearance-none mt-0.5 size-3 rounded-sm border border-blue-950',
            'bg-contain checked:bg-[url(/icons/check.svg)]'
          )}
          type="checkbox"
          id={id}
          checked={isChecked.value}
          onChange={(event) => {
            const target = event.target as HTMLInputElement
            isChecked.value = target.checked
          }}
        />
        <label class="font-display text-xs" for={id}>
          Leí y acepto los{' '}
          <a
            class="font-medium underline hover:text-purple-900"
            href="/terminos-y-condiciones"
            target="_blank"
          >
            Términos y Condiciones
          </a>{' '}
          y{' '}
          <a
            class="font-medium underline hover:text-purple-900"
            href="/politicas-de-privacidad"
            target="_blank"
          >
            Políticas de Privacidad.
          </a>
        </label>
      </div>
      <Button
        class="flex items-center"
        loading={isLoading.value}
        disabled={
          docNumber.value.length !== 8 ||
          phone.value.length !== 9 ||
          !isChecked.value
        }
      >
        Solicitar efectivo <IconArrow />
      </Button>
    </form>
  )
}
