import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { Cycle, cyclesRecucer } from '../../reducers/cycles/reducer'
import {
  addNewCycleAction,
  markCurrentCycleAsFinishedAction,
  interruptCurrentCycleAction,
} from '../../reducers/cycles/actions'
import { differenceInSeconds } from 'date-fns'

interface IPropsCreateCycleData {
  task: string
  minutesAmount: number
}

interface IPropsCyclesContext {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: IPropsCreateCycleData) => void
  interruptCurrentCycle: () => void
}

export const CyclesContext = createContext({} as IPropsCyclesContext)

interface IPropsCycleContextProvider {
  children: ReactNode
}

export function CycleContextProvider({ children }: IPropsCycleContextProvider) {
  const [cyclesState, dispatch] = useReducer(
    cyclesRecucer,
    {
      cycles: [],
      activeCycleId: null,
    },
    (initialState) => {
      const storageStateAsJson = localStorage.getItem(
        '@ignite-time:cycles-state-1.0.0',
      )

      if (storageStateAsJson) {
        return JSON.parse(storageStateAsJson)
      }

      return initialState
    },
  )

  const { cycles, activeCycleId } = cyclesState

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
    }

    return 0
  })

  useEffect(() => {
    const stateJson = JSON.stringify(cyclesState)
    localStorage.setItem('@ignite-time:cycles-state-1.0.0', stateJson)
  }, [cyclesState])

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction())
  }

  function createNewCycle(data: IPropsCreateCycleData) {
    const id = String(new Date().getTime())
    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch(addNewCycleAction(newCycle))
    setAmountSecondsPassed(0)
  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction())
  }

  return (
    <CyclesContext.Provider
      value={{
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
        cycles,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}

export function useCycles() {
  const context = useContext(CyclesContext)
  return context
}
