import { useSignal } from '@preact/signals'
import { actions } from 'astro:actions'
import { format } from '@formkit/tempo'
import { navigate } from 'astro:transitions/client'
import clsx from 'clsx/lite'
import IconArrow from '@/components/icons/Arrow'
import Input from '@/components/Input'
import Button from '@/components/Button'

interface Props {
  docNumber: string
}

export default function Form({ docNumber }: Props) {
  const isLoading = useSignal(false)
  const firstName = useSignal('')
  const lastName = useSignal('')
  const email = useSignal('')
  const activityType = useSignal('')
  const salary = useSignal('')
  const dateOfBirth = useSignal('')
  const workStartDate = useSignal('')

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault()

    isLoading.value = true

    const result = await actions.sendRequest({
      script: 37,
      data: {
        docNumber,
        firstName: firstName.value,
        lastName: lastName.value,
        activityType: activityType.value,
        salary: salary.value,
        dateOfBirth: format(dateOfBirth.value, 'medium'),
        workStartDate: format(workStartDate.value, 'medium'),
        email: email.value
      }
    })

    result.error
      ? (isLoading.value = false)
      : navigate(result.data!, { history: 'replace' })
  }

  return (
    <form
      class={clsx(
        'mb-28 p-7 grid gap-7 rounded-3xl bg-neutral-100 text-blue-950',
        'md:grid-cols-2'
      )}
      onSubmit={handleSubmit}
    >
      <div class="grid gap-6">
        <Input
          placeholder="Nombre"
          value={firstName.value}
          onInput={(event) => {
            const target = event.target as HTMLInputElement
            firstName.value = target.value
          }}
        />
        <Input
          placeholder="Apellido"
          value={lastName.value}
          onInput={(event) => {
            const target = event.target as HTMLInputElement
            lastName.value = target.value
          }}
        />
        <Input value={docNumber} readonly />
        <Input
          type="email"
          placeholder="Email"
          value={email.value}
          onInput={(event) => {
            const target = event.target as HTMLInputElement
            email.value = target.value
          }}
        />
      </div>
      <div class="grid">
        <select
          class={clsx(
            'appearance-none mb-6 px-5 py-3 rounded-4xl font-display text-sm',
            activityType.value ? 'text-blue-950' : 'text-neutral-400',
            'outline-1 -outline-offset-1 outline-blue-950 active:text-blue-950',
            'active:outline-2 active:-outline-offset-2 active:outline-orange-500'
          )}
          onChange={(event) => {
            const target = event.target as HTMLSelectElement
            activityType.value = target.value
          }}
        >
          <option value="" hidden>
            Actividad laboral
          </option>
          <option>Privado</option>
          <option>Público</option>
          <option>Jubilado</option>
          <option>Independiente</option>
          <option>Desempleado</option>
        </select>
        <Input
          class="mb-2"
          type="number"
          placeholder="Salario mensual"
          value={salary.value}
          onInput={(event) => {
            const target = event.target as HTMLInputElement
            salary.value = target.value
          }}
        />
        <Input
          class={clsx(
            'mb-2',
            dateOfBirth.value ? 'text-blue-950' : 'text-neutral-400'
          )}
          type="date"
          label="Fecha de nacimiento"
          value={dateOfBirth.value}
          onInput={(event) => {
            const target = event.target as HTMLInputElement
            dateOfBirth.value = target.value
          }}
        />
        <Input
          class={workStartDate.value ? 'text-blue-950' : 'text-neutral-400'}
          type="date"
          label="Fecha de ingreso al trabajo actual"
          value={workStartDate.value}
          onInput={(event) => {
            const target = event.target as HTMLInputElement
            workStartDate.value = target.value
          }}
        />
      </div>
      <Button
        class="mt-2 w-fit flex items-center"
        loading={isLoading.value}
        disabled={
          !firstName.value ||
          !lastName.value ||
          !email.value ||
          !activityType.value ||
          !salary.value ||
          !dateOfBirth.value ||
          !workStartDate.value
        }
      >
        Solicitar efectivo <IconArrow />
      </Button>
    </form>
  )
}
