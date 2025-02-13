import { useSignal } from '@preact/signals'
import { actions } from 'astro:actions'
import clsx from 'clsx/lite'
import IconPhotoUp from './icons/PhotoUp'

interface Props {
  class?: string
  label: string
  name: string
}

export default function InputImage({ class: className, label, name }: Props) {
  const isLoading = useSignal(false)
  const image = useSignal(`/images/${name}`)

  function handleChange(event: Event) {
    const eventTarget = event.target as HTMLInputElement
    const file = eventTarget.files?.[0]

    if (file) {
      const reader = new FileReader()

      reader.onload = async () => {
        isLoading.value = true

        await actions.setImage({ name, data: reader.result as string })

        image.value = reader.result as string
        isLoading.value = false
      }

      reader.readAsDataURL(file)
    }
  }

  return (
    <div class="mb-6 break-inside-avoid">
      <header class="mb-1 mx-2 flex items-center justify-between">
        <label class="font-display text-sm" for={name}>
          {label}
        </label>
        {!isLoading.value && (
          <label class="text-orange-500 hover:text-orange-500/80">
            <IconPhotoUp />
            <input
              class="sr-only"
              type="file"
              id={name}
              accept="image/*"
              onChange={handleChange}
            />
          </label>
        )}
      </header>
      <figure
        class={clsx(
          'aspect-7/3 p-2 grid place-items-center rounded-lg border',
          'border-dashed border-neutral-400',
          className,
          isLoading.value && 'bg-neutral-400/25 animate-pulse'
        )}
      >
        {!isLoading.value && <img src={image.value} alt="" />}
      </figure>
    </div>
  )
}
