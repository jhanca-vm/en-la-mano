import { actions } from 'astro:actions'
import { navigate } from 'astro:transitions/client'
import clsx from 'clsx/lite'
import Input from '@/components/Input'
import Textarea from '@/components/Textarea'
import Button from '@/components/Button'
import IconArrow from '@/components/icons/Arrow'

export default function Form() {
  async function action(formData: FormData) {
    const data = Object.fromEntries(formData)
    const result = await actions.addComplaint(data as Record<string, string>)

    if (!result.error) {
      await navigate(`/result?token=${result.data}`, { history: 'replace' })
    }
  }

  return (
    <form
      className={clsx(
        'my-12 p-8 rounded-4xl bg-neutral-100 font-normal text-left',
        'text-blue-900'
      )}
      action={action}
    >
      <h2>Completá el formulario</h2>
      <div className="my-6 grid gap-4 sm:grid-cols-2 md:gap-x-7">
        <Input name="firstName" placeholder="Nombre" />
        <Input name="lastName" placeholder="Apellido" />
        <Input
          type="number"
          name="docNumber"
          placeholder="Cédula (sin puntos ni guiones)"
          required
        />
        <Input type="email" name="email" placeholder="Email" required />
        <Input
          type="number"
          name="mobilephone"
          placeholder="Celular"
          required
        />
        <Input type="number" name="phone" placeholder="Teléfono" />
        <Textarea
          className="sm:col-span-2"
          name="comments"
          placeholder="Comentarios"
          rows={4}
          required
        />
      </div>
      <Button className="flex items-center">
        Enviar reclamo <IconArrow />
      </Button>
    </form>
  )
}
