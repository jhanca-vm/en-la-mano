import { useRef, useState } from 'react'
import { actions } from 'astro:actions'
import clsx from 'clsx/lite'
import Input from './Input'
import Button from './Button'

interface Props {
  username?: string
}

export default function ChangePassword({ username }: Props) {
  const ref = useRef<HTMLDialogElement>(null)
  const [error, setError] = useState<string>()

  async function action(formData: FormData) {
    const data = Object.fromEntries(formData)
    const { error } = await actions.changePassword({ username, ...data })

    if (error) {
      setError(error.message)
    } else {
      ref.current?.close()
    }
  }

  return (
    <>
      <Button onClick={() => ref.current?.showModal()}>
        Cambiar Contraseña
      </Button>
      <dialog
        className={clsx(
          'max-w-xs w-full m-auto p-6 pt-3 rounded-3xl bg-white',
          'backdrop:bg-black/60'
        )}
        ref={ref}
      >
        <form className="mt-3 grid gap-3" action={action}>
          <Input
            type="password"
            name="password"
            placeholder="Contraseña actual"
          />
          <Input
            type="password"
            name="newPassword"
            placeholder="Nueva contraseña"
          />
          {error && (
            <p className="ml-5 text-sm text-orange-500 leading-none">{error}</p>
          )}
          <Button className="flex justify-center" type="submit">
            Cambiar
          </Button>
        </form>
      </dialog>
    </>
  )
}
