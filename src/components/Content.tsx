import type { ComponentChildren } from 'preact'
import { useSignal } from '@preact/signals'
import { actions } from 'astro:actions'
import { useEffect } from 'preact/hooks'
import clsx from 'clsx/lite'
import { isUnchanged, reset, state } from '@/store'
import Button from './Button'

interface Props {
  initialState: string
  children: ComponentChildren
}

export default function Content({ initialState, children }: Props) {
  const isLoading = useSignal(true)

  async function handleClcik() {
    isLoading.value = true

    await actions.setData(state.value)

    reset(JSON.stringify(state.value))

    isLoading.value = false
  }

  useEffect(() => {
    reset(initialState)

    isLoading.value = false
  }, [])

  return (
    <main class="px-4 grow md:px-8">
      <Button
        class="sticky top-4 mt-4 mb-6 ml-auto block"
        disabled={isUnchanged.value}
        loading={isLoading.value}
        onClick={handleClcik}
      >
        Guardar
      </Button>
      <div
        class={clsx(
          isLoading.value && 'opacity-75 animate-pulse pointer-events-none',
          'max-w-sm mx-auto lg:max-w-3xl'
        )}
      >
        {children}
      </div>
    </main>
  )
}
