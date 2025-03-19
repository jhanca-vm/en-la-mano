import type { User } from '@prisma/client'
import { useState } from 'react'
import clsx from 'clsx/lite'
import Select from './Select'

interface Props {
  token: string
  users: User[]
}

export default function DownloadCSV({ token, users }: Props) {
  const [year, setYear] = useState('')
  const [month, setMonth] = useState('')

  let pathname = `/leads?token=${token}`

  if (year) pathname += `&year=${year}`
  if (month) pathname += `&month=${month}`

  return (
    <div className="mb-5 flex justify-end items-center gap-2">
      <Select
        value={year}
        onChange={({ target: { value } }) => {
          setYear(value)
          if (!value) setMonth('')
        }}
      >
        <option value="">Año</option>
        {Array.from(
          new Set(users.map((user) => user.createdAt.getFullYear()))
        ).map((year) => (
          <option key={year}>{year}</option>
        ))}
      </Select>
      <Select
        value={month}
        disabled={!year}
        onChange={(event) => setMonth(event.target.value)}
      >
        <option value="">Mes</option>
        {Array.from(
          new Set(users.map((user) => user.createdAt.getMonth() + 1))
        ).map((month) => (
          <option key={month}>{month}</option>
        ))}
      </Select>
      <a
        className={clsx(
          'px-5 py-2.25 rounded-full bg-orange-500 text-neutral-100',
          'hover:bg-orange-500/90'
        )}
        href={pathname}
        download
      >
        Descargar
      </a>
    </div>
  )
}
