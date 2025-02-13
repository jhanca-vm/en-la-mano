import set from 'just-safe-set'
import debounce from 'just-debounce-it'
import { json, state } from '@/store'
import IconTrash from '@/components/icons/Trash'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Textarea from '@/components/Textarea'

type Questions = Array<[string, { question: string; answer: string }]>

export default function List() {
  const questions: Questions = state.value.data?.questions || []

  function add() {
    const newState = JSON.parse(json.value)

    set(newState, 'data.questions', [
      [crypto.randomUUID(), { question: '', answer: '' }],
      ...newState.data.questions
    ])

    json.value = JSON.stringify(newState)
  }

  function handleInput(
    event: InputEvent,
    id: string,
    key: 'question' | 'answer'
  ) {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement
    const newState = JSON.parse(json.value)
    const map = new Map(newState.data.questions)
    const item = map.get(id) as Record<string, string>

    item[key] = target.value

    map.set(id, item)

    newState.data.questions = Array.from(map.entries())
    json.value = JSON.stringify(newState)
  }

  function remove(id: string) {
    const newState = JSON.parse(json.value)
    const map = new Map(newState.data.questions)

    map.delete(id)

    newState.data.questions = Array.from(map.entries())
    json.value = JSON.stringify(newState)
  }

  return (
    <section className="my-12">
      <Button onClick={add}>Añadir</Button>
      {questions.map(([id, { question, answer }]) => (
        <div
          class={'my-12 grid grid-cols-[1fr_max-content] items-start gap-6'}
          key={id}
        >
          <Input
            name="question"
            value={question}
            placeholder="Pregunta"
            onInput={debounce(
              (event: InputEvent) => handleInput(event, id, 'question'),
              500
            )}
          />
          <Textarea
            name="answer"
            value={answer}
            placeholder="Respuesta"
            onInput={(event) => handleInput(event, id, 'answer')}
          />
          <button
            class={
              'mt-2 col-start-2 row-start-1 row-span-2 hover:text-purple-900'
            }
            onClick={() => remove(id)}
          >
            <IconTrash />
          </button>
        </div>
      ))}
    </section>
  )
}
