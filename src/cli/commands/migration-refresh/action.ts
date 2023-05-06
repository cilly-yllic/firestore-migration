import { ActionArg } from '../../../internal/types/command.js'
import { RefreshOptions } from '../../../internal/types/options.js'
import { down, getFilePaths as getRollbackFilePaths } from '../../../internal/utils/command/migration-rollback.js'
import { up, getFilePaths as getMigrationFilePaths } from '../../../internal/utils/command/migration.js'
import { bullet, table } from '../../../internal/utils/log.js'
import { ENVS, get } from '../../../internal/utils/process.js'

export const action = async ({ app, firestore, options, settings: __ }: ActionArg<RefreshOptions>) => {
  const filePaths = await getRollbackFilePaths(firestore, options.step)
  if (!filePaths.length) {
    bullet('nothing files to rollback')
  }
  if (get(ENVS.IS_DEBUG)) {
    table(filePaths)
    return
  }
  await down(app, filePaths)
  const { filePaths: migrationFilePaths, batch } = await getMigrationFilePaths(firestore)
  if (!migrationFilePaths.length) {
    bullet('nothing files to migrate')
  }
  return up(app, migrationFilePaths, batch + 1)
}
