import { useSignal } from '@preact/signals'
import clone from 'just-clone'
import set from 'just-safe-set'
import { actions } from 'astro:actions'
import clsx from 'clsx/lite'
import { json, reset, state } from '@/store'
import IconTrash from '@/components/icons/Trash'
import Input from '@/components/Input'
import InputImage from '@/components/InputImage'
import Textarea from '@/components/Textarea'
import Button from '@/components/Button'

interface Landing {
  name: string
  bannerText: string
}

export default function List() {
  const isLoading = useSignal(false)
  const name = useSignal('')
  const landings: Landing[] = state.value.data?.landings || []

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault()

    const target = event.target as HTMLFormElement
    const newState = clone(state.value)

    isLoading.value = true

    set(newState, 'data.landings', [
      { name: name.value, bannerText: '' },
      ...landings
    ])

    await actions.setData(newState)

    reset(JSON.stringify(newState))
    target.reset()

    name.value = ''
    isLoading.value = false
  }

  async function handleDelete(landingName: string) {
    const newState = clone(state.value)

    isLoading.value = true
    newState.data.landings = landings.filter(({ name }) => name !== landingName)

    await Promise.all([
      actions.setData(newState),
      actions.deleteImage(`${landingName}-banner`)
    ])

    reset(JSON.stringify(newState))

    isLoading.value = false
  }

  function handleInput(event: InputEvent, landingName: string) {
    const target = event.target as HTMLInputElement
    const newState = JSON.parse(json.value)

    newState.data.landings = landings.map((landing) => {
      if (landing.name === landingName) landing.bannerText = target.value

      return landing
    })

    json.value = JSON.stringify(newState)
  }

  return (
    <>
      <form class="my-12 flex items-center gap-2" onSubmit={handleSubmit}>
        <Input
          class="bg-neutral-100"
          name="name"
          placeholder="Nombre de la landing"
          value={name.value}
          onInput={(event) => {
            const target = event.target as HTMLInputElement
            name.value = target.value.trim()
          }}
        />
        <Button
          loading={isLoading.value}
          disabled={
            !name.value ||
            landings.some((landing) => landing.name === name.value)
          }
        >
          Añadir
        </Button>
      </form>
      {landings.map(({ name, bannerText }, index) => (
        <div
          class={clsx('my-12', isLoading.value && 'opacity-50 animate-pulse')}
          key={name}
        >
          <header
            class={clsx(
              'mb-4 pb-1 flex items-center justify-between border-b',
              'border-neutral-400'
            )}
          >
            <h2 class="text-lg">{name}</h2>
            <button
              class="text-orange-500 hover:text-orange-500/80"
              onClick={() => handleDelete(name)}
            >
              <IconTrash />
            </button>
          </header>
          <div class="lg:columns-2 lg:gap-6">
            <InputImage label="Imagen del banner" name={`${name}-banner`} />
            <Textarea
              label="Texto del banner"
              name={`${name}-banner-text`}
              value={bannerText}
              onInput={(event) => handleInput(event, name)}
            />
          </div>
        </div>
      ))}
    </>
  )
}
