import { actions } from 'astro:actions'
import { navigate } from 'astro:transitions/client'
import type { Admin } from '@prisma/client'
import clsx from 'clsx/lite'
import IconQrcodeOff from './icons/QrcodeOff'
import IconTrash from './icons/Trash'
import Input from './Input'
import Button from './Button'

interface Props {
  data: Admin[]
}

export default function Admins({ data }: Props) {
  return (
    <div className="max-w-xs mx-auto my-15">
      <form
        action={async (formData) => {
          await actions.createAdmin(formData)
          await navigate('/admin/usuarios')
        }}
      >
        <div className="my-4 grid gap-3">
          <Input name="username" placeholder="Usuario" />
          <Input type="password" name="password" placeholder="Contraseña" />
        </div>
        <Button className="flex items-center" type="submit">
          Crear usuario
        </Button>
      </form>
      <ul className="mt-10">
        {data.map(({ username, secret }) => (
          <li
            className={clsx(
              'p-1 flex justify-between border-t border-purple-900',
              'last:border-b'
            )}
            key={username}
          >
            {username}
            <div className="flex gap-2 text-purple-500">
              {secret && (
                <button
                  className="transition-colors hover:text-purple-900"
                  onClick={async () => {
                    await actions.regenerateQr(username)
                    await navigate('/admin/usuarios')
                  }}
                >
                  <IconQrcodeOff />
                </button>
              )}
              {username !== 'adminelm' && (
                <button
                  className="transition-colors hover:text-purple-900"
                  onClick={async () => {
                    await actions.deleteAdmin(username)
                    await navigate('/admin/usuarios')
                  }}
                >
                  <IconTrash />
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
