import { actions } from 'astro:actions'
import Input from './Input'
import Button from './Button'

export default function CreateAdmin() {
  return (
    <form
      className="max-w-xs mx-auto pt-6 pb-15 rounded-3xl bg-neutral-100"
      action={actions.signUp}
    >
      <h1 className="text-center leading-none">Añadir Usuario</h1>
      <div className="my-6 grid gap-3">
        <Input name="username" placeholder="Usuario" />
        <Input type="password" name="password" placeholder="Contraseña" />
      </div>
      <Button className="flex items-center" type="submit">
        Crear Cuenta
      </Button>
    </form>
  )
}
