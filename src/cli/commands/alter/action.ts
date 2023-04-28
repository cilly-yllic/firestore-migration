import { get, ENVS } from '../../../internal/utils/process.js'
import { ActionArg } from '../../../internal/types/command.js'

export const action = async ({ app, firestore, options, settings }: ActionArg) => {
  console.log('--- IS_EMULATOR ---', get(ENVS.IS_EMULATOR))
}