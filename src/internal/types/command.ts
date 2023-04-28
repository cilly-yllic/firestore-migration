import {Options} from './options.js'
import {Settings} from './settings.js'
import {AppClass} from '../utils/app.js'
import {FirestoreClass} from '../utils/firestore.js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Action = (...args: any[]) => any

export interface BeforeFunction {
  fn: Action;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args: any[];
}

export interface ActionArg {
  options: Options
  settings: Settings
  app: AppClass
  firestore: FirestoreClass
}