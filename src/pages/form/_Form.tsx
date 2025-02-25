import { useState } from 'react'
import { actions } from 'astro:actions'
import { navigate } from 'astro:transitions/client'
import { format } from '@formkit/tempo'
import clsx from 'clsx/lite'
import IconArrow from '@/components/icons/Arrow'
import Input from '@/components/Input'
import Button from '@/components/Button'

interface Props {
  docNumber: string
}

export default function Form({ docNumber }: Props) {
  const [activityType, setActivityType] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [workStartDate, setWorkStartDate] = useState('')

  async function handleRequest(formData: FormData) {
    const data = Object.fromEntries(formData)
    const result = await actions.sendRequest({
      script: 37,
      data: {
        ...data,
        docNumber,
        dateOfBirth: format(dateOfBirth, 'medium'),
        workStartDate: format(workStartDate, 'medium')
      }
    })

    if (!result.error) await navigate(result.data!, { history: 'replace' })
  }

  return (
    <form
      className={clsx(
        'mb-28 p-7 grid gap-7 rounded-3xl bg-neutral-100 text-blue-950',
        'md:grid-cols-2'
      )}
      action={handleRequest}
    >
      <div className="grid gap-6">
        <Input name="firstName" placeholder="Nombre" required />
        <Input name="lastName" placeholder="Apellido" required />
        <Input defaultValue={docNumber} readonly />
        <Input name="email" type="email" placeholder="Email" required />
      </div>
      <div className="grid">
        <select
          className={clsx(
            'appearance-none mb-6 px-5 py-3 rounded-4xl font-display text-sm',
            activityType ? 'text-blue-950' : 'text-neutral-400',
            'outline-1 -outline-offset-1 outline-blue-950 active:text-blue-950',
            'active:outline-2 active:-outline-offset-2',
            'active:outline-orange-500'
          )}
          name="activityType"
          required
          onChange={(event) => setActivityType(event.target.value)}
        >
          <option value="" hidden>
            Actividad laboral
          </option>
          <option>Privado</option>
          <option>Público</option>
          <option>Jubilado</option>
          <option>Independiente</option>
        </select>
        <Input
          className="mb-2"
          type="number"
          name="salary"
          placeholder="Salario mensual"
          required
        />
        <Input
          className={clsx(
            'mb-2',
            dateOfBirth ? 'text-blue-950' : 'text-neutral-400'
          )}
          type="date"
          label="Fecha de nacimiento"
          value={dateOfBirth}
          required
          onInput={(event) => setDateOfBirth(event.currentTarget.value)}
        />
        <Input
          className={workStartDate ? 'text-blue-950' : 'text-neutral-400'}
          type="date"
          label="Fecha de ingreso al trabajo actual"
          value={workStartDate}
          required
          onInput={(event) => setWorkStartDate(event.currentTarget.value)}
        />
      </div>
      <Button className="mt-2 w-fit flex items-center">
        Solicitar efectivo <IconArrow />
      </Button>
    </form>
  )
}
