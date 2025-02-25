import { useId, useState, type ChangeEvent } from 'react'
import { actions } from 'astro:actions'
import clsx from 'clsx/lite'
import IconPhotoUp from './icons/PhotoUp'

interface Props {
  className?: string
  label: string
  name: string
}

export default function InputImage({ className, label, name }: Props) {
  const id = useId()
  const [isLoading, setIsLoading] = useState(false)

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (file) {
      const reader = new FileReader()

      reader.onload = () => {
        setIsLoading(true)
        actions.setImage({ name, data: reader.result as string })
      }

      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="mb-6 break-inside-avoid">
      <header className="mb-1 mx-2 flex items-center justify-between">
        <label className="font-display text-sm" htmlFor={id}>
          {label}
        </label>
        {!isLoading && (
          <label className="text-orange-500 hover:text-orange-500/80">
            <IconPhotoUp />
            <input
              className="sr-only"
              type="file"
              id={id}
              accept="image/*"
              onChange={handleChange}
            />
          </label>
        )}
      </header>
      <figure
        className={clsx(
          'aspect-7/3 p-2 grid place-items-center rounded-lg border',
          'border-dashed border-neutral-400',
          className,
          isLoading && 'bg-neutral-400/25 animate-pulse'
        )}
      >
        {!isLoading && <img src={`/images/${name}`} alt="" />}
      </figure>
    </div>
  )
}
