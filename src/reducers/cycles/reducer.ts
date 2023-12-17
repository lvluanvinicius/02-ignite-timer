import { produce } from 'immer'
import { ActionTypes } from './actions'

export interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CycleState {
  cycles: Cycle[]
  activeCycleId: string | null
}

export function cyclesRecucer(state: CycleState, action: any) {
  switch (action.type) {
    case ActionTypes.newCycle:
      return produce(state, (draft) => {
        draft.cycles.push(action.payload.newCycle)
        draft.activeCycleId = action.payload.newCycle.id
      })
    case ActionTypes.interruptCurrentCycle: {
      const currentCyclesIndex = state.cycles.findIndex(
        (cycle) => cycle.id === state.activeCycleId,
      )

      if (currentCyclesIndex < 0) {
        return state
      }
      return produce(state, (draft) => {
        draft.cycles[currentCyclesIndex].interruptedDate = new Date()
        draft.activeCycleId = null
      })
    }
    case ActionTypes.markCurrentCycleAsFinished: {
      const currentCyclesIndex = state.cycles.findIndex(
        (cycle) => cycle.id === state.activeCycleId,
      )

      if (currentCyclesIndex < 0) {
        return state
      }
      return produce(state, (draft) => {
        draft.cycles[currentCyclesIndex].finishedDate = new Date()
        draft.activeCycleId = null
      })
    }

    default:
      return state
  }
}
