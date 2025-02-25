import useList from '@/lib/useList'
import IconTrash from '@/components/icons/Trash'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Textarea from '@/components/Textarea'

type Question = [string, { question: string; answer: string }]

interface Props {
  questions: Question[]
}

function reducer(state: any[], [id, value]: Question) {
  return state.map((question) => (question[0] === id ? [id, value] : question))
}

export default function List({ questions }: Props) {
  const { state, dispatch, add, remove } = useList(
    'questions',
    reducer,
    questions
  )

  return (
    <section className="my-12">
      <Button
        type="button"
        onClick={(event) => {
          add(event, [crypto.randomUUID(), { question: '', answer: '' }])
        }}
      >
        Añadir
      </Button>
      {state.map(([id, { question, answer }]) => (
        <div
          className="my-12 grid grid-cols-[1fr_max-content] items-start gap-6"
          key={id}
        >
          <Input
            name="question"
            value={question}
            placeholder="Pregunta"
            onInput={(event) => {
              dispatch([id, { question: event.currentTarget.value, answer }])
            }}
          />
          <Textarea
            name="answer"
            value={answer}
            placeholder="Respuesta"
            onInput={(event) => {
              dispatch([id, { question, answer: event.currentTarget.value }])
            }}
          />
          <button
            type="button"
            className={
              'mt-2 col-start-2 row-start-1 row-span-2 hover:text-purple-900'
            }
            onClick={() => remove(([questionId]) => questionId !== id)}
          >
            <IconTrash />
          </button>
        </div>
      ))}
    </section>
  )
}
