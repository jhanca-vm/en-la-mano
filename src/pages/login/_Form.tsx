import { useRef, useState } from 'react'
import { actions } from 'astro:actions'
import { navigate } from 'astro:transitions/client'
import Input from '@/components/Input'
import Button from '@/components/Button'
import IconArrow from '@/components/icons/Arrow'
import clsx from 'clsx'

export default function Form() {
  const ref = useRef<HTMLDialogElement>(null)
  const [username, setUsername] = useState<string>()
  const [error, setError] = useState<string>()
  const [qr, setQr] = useState<string>()
  const [secret, setSecret] = useState<string>()

  async function signIn(formData: FormData) {
    const { error, data } = await actions.signIn(formData)

    if (error) {
      setError(error.message)
    } else {
      setError(undefined)
      setQr(data?.qr)
      setSecret(data?.secret)
      setUsername(formData.get('username') as string)
      ref.current?.showModal()
    }
  }

  async function validateTotp(formData: FormData) {
    const { error, data } = await actions.validateTotp({
      secret,
      code: formData.get('code'),
      isRegistered: !qr,
      username
    })

    if (error) {
      setError(error.message)
    } else {
      document.cookie = `token=${data}`
      await navigate('/admin')
    }
  }

  return (
    <>
      <form
        className="max-w-sm w-full m-auto p-8 pt-7 rounded-3xl bg-neutral-100"
        action={signIn}
      >
        <h1 className="leading-none">Inicia sesión</h1>
        <div className="my-6 grid gap-3">
          <Input name="username" placeholder="Usuario" />
          <Input type="password" name="password" placeholder="Contraseña" />
          {error && <p className="ml-5 text-sm text-orange-500">{error}</p>}
        </div>
        <Button className="flex items-center" type="submit">
          Iniciar sesión <IconArrow />
        </Button>
      </form>
      <dialog
        ref={ref}
        className={clsx(
          'max-w-sm w-full m-auto p-6 pt-3 rounded-3xl bg-white',
          'backdrop:bg-purple-900'
        )}
      >
        {qr && <img className="mx-auto" src={qr} alt="" />}
        <form className="mt-3 flex gap-3" action={validateTotp}>
          <Input
            className="grow"
            type="number"
            name="code"
            placeholder="Código de verificación"
          />
          <Button>Enviar</Button>
        </form>
        {error && (
          <p className="mt-1.5 ml-5 text-sm text-orange-500">{error}</p>
        )}
      </dialog>
    </>
  )
}
