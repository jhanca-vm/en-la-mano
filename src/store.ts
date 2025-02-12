import { computed, signal } from '@preact/signals'

interface State {
  pattern?: string
  data?: any
}

export const currentState = signal('{}')

export const json = signal('{}')

export const isUnchanged = computed(() => json.value === currentState.value)

export const state = computed<State>(() => JSON.parse(json.value))

export function reset(data: string) {
  currentState.value = data
  json.value = data
}
