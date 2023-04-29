import { ActionArg } from '../../../internal/types/command.js'
import { get, ENVS } from '../../../internal/utils/process.js'

export const action = async ({ app: _, firestore: __, options: ___, settings: ____ }: ActionArg) => {
  console.log('--- IS_EMULATOR ---', get(ENVS.IS_EMULATOR))
}
