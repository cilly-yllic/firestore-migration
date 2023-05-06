import { ActionArg } from '../../../internal/types/command.js'
import { MigrateOptions } from '../../../internal/types/options.js'
import { up, getFilePaths } from '../../../internal/utils/command/migration.js'
import { bullet, table } from '../../../internal/utils/log.js'
import { ENVS, get } from '../../../internal/utils/process.js'

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
