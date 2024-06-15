import { ActionArg } from '../../../_internal/types/command.js'
import { MigrateOptions } from '../../../_internal/types/options.js'
import { up, getFilePaths } from '../../../_internal/utils/command/migration.js'
import { bullet, table } from '../../../_internal/utils/log.js'
import { ENVS, get } from '../../../_internal/utils/process.js'

export const action = async ({ app, firestore, options: _, settings: __ }: ActionArg<MigrateOptions>) => {
  const { filePaths, batch } = await getFilePaths(firestore)
  if (!filePaths.length) {
    bullet('nothing files to migrate')
  }
  if (get(ENVS.IS_DEBUG)) {
    table(filePaths)
    return
  }
  return up(app, filePaths, batch + 1)
}
