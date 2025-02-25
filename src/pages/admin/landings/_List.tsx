import { useState } from 'react'
import { actions } from 'astro:actions'
import clsx from 'clsx/lite'
import useList from '@/lib/useList'
import IconTrash from '@/components/icons/Trash'
import Input from '@/components/Input'
import InputImage from '@/components/InputImage'
import Textarea from '@/components/Textarea'
import Button from '@/components/Button'

interface Landing {
  name: string
  bannerText: string
}

interface Props {
  landings: Landing[]
}

function reducer(state: Landing[], { name, bannerText }: Landing) {
  return state.map((landing) => {
    return landing.name === name ? { name, bannerText } : landing
  })
}

export default function List({ landings }: Props) {
  const [name, setName] = useState('')
  const { state, dispatch, add, remove } = useList(
    'landings',
    reducer,
    landings
  )

  return (
    <>
      <div className="mt-6 mb-12 flex items-end gap-2">
        <Input
          className="bg-neutral-100"
          label="Añadir landing"
          placeholder="Nombre de la landing"
          value={name}
          onInput={(event) => setName(event.currentTarget.value)}
        />
        <Button
          type="button"
          disabled={!name || state.some((landing) => landing.name === name)}
          onClick={(event) => add(event, { name, bannerText: '' })}
        >
          Añadir
        </Button>
      </div>
      {state.map(({ name, bannerText }) => (
        <div className="my-12" key={name}>
          <header
            className={clsx(
              'mb-4 pb-1 flex items-center justify-between border-b',
              'border-neutral-400'
            )}
          >
            <h2 className="text-lg">{name}</h2>
            {name !== 'home' && (
              <button
                type="button"
                className="text-orange-500 hover:text-orange-500/80"
                onClick={() => {
                  remove(
                    (landing) => landing.name !== name,
                    () => actions.deleteImage(`${name}-banner`)
                  )
                }}
              >
                <IconTrash />
              </button>
            )}
          </header>
          <div className="lg:columns-2 lg:gap-6">
            <InputImage label="Imagen del banner" name={`${name}-banner`} />
            <Textarea
              label="Texto del banner"
              value={bannerText}
              onInput={(event) => {
                dispatch({ name, bannerText: event.currentTarget.value })
              }}
            />
          </div>
        </div>
      ))}
    </>
  )
}
