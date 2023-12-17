import { Cycle } from './reducer'

export enum ActionTypes {
  newCycle = 'newCycle',
  interruptCurrentCycle = 'interruptCurrentCycle',
  markCurrentCycleAsFinished = 'markCurrentCycleAsFinished',
}

export function addNewCycleAction(newCycle: Cycle) {
  return {
    type: ActionTypes.newCycle,
    payload: { newCycle },
  }
}

export function interruptCurrentCycleAction() {
  return {
    type: ActionTypes.interruptCurrentCycle,
  }
}

export function markCurrentCycleAsFinishedAction() {
  return {
    type: ActionTypes.markCurrentCycleAsFinished,
  }
}
