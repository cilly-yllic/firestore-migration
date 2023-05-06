import { ActionArg } from '../../../internal/types/command.js'
import { RollbackOptions } from '../../../internal/types/options.js'
import { down, getFilePaths } from '../../../internal/utils/command/migration-rollback.js'
import { bullet, table } from '../../../internal/utils/log.js'
import { ENVS, get } from '../../../internal/utils/process.js'

export const action = async ({ app, firestore, options, settings: __ }: ActionArg<RollbackOptions>) => {
  const filePaths = await getFilePaths(firestore, options.step)
  if (!filePaths.length) {
    bullet('nothing files to rollback')
  }
  if (get(ENVS.IS_DEBUG)) {
    table(filePaths)
    return
  }
  return down(app, filePaths)
}
