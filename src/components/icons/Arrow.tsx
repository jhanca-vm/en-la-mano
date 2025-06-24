import clsx from 'clsx/lite'

export default function IconArrow() {
  return (
    <span
      className={clsx(
        'ml-3 -mr-3 size-5 grid place-items-center rounded-full',
        'bg-neutral-100'
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={clsx(
          'w-3 fill-none stroke-[1.25] stroke-orange-500',
          'group-disabled:stroke-orange-500/45'
        )}
        fill="none"
        viewBox="0 0 12 8"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.667 4H1.333M7.75 6.917S10.667 4.769 10.667 4c0-.769-2.917-2.917-2.917-2.917"
        />
      </svg>
    </span>
  )
}
