import { useEffect, useReducer, useRef, type MouseEvent } from 'react'
import { actions } from 'astro:actions'

export default function useList<T>(
  name: string,
  reducer: (state: T[], payload: T) => T[],
  initialState: T[]
) {
  const form = useRef<HTMLFormElement>(null)
  const [state, dispatch] = useReducer(reducer, initialState)

  function getData() {
    const formData = new FormData(form.current!)

    return Object.fromEntries(formData) as Record<string, string | T[]>
  }

  function add(event: MouseEvent<HTMLButtonElement>, newItem: T) {
    const data = getData()

    event.currentTarget.disabled = true
    form.current!.className += ' opacity-75 pointer-events-none animate-pulse'
    data[name] = [newItem, ...state]

    actions.setData(data)
  }

  async function remove(
    predicate: (value: T) => boolean,
    callback?: () => Promise<any>
  ) {
    const data = getData()

    form.current!.className += ' opacity-75 pointer-events-none animate-pulse'
    data[name] = state.filter(predicate)

    await Promise.all([actions.setData(data), callback?.()])
  }

  useEffect(() => {
    form.current = document.querySelector('form')

    form.current!.onsubmit = (event) => {
      event.preventDefault()

      const data = getData()

      data[name] = state

      actions.setData(data)
    }
  }, [state])

  return { state, dispatch, add, remove }
}
