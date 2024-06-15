import { ActionArg } from '../../../_internal/types/command.js'
import { RefreshOptions } from '../../../_internal/types/options.js'
import { down, getFilePaths as getRollbackFilePaths } from '../../../_internal/utils/command/migration-rollback.js'
import { up, getFilePaths as getMigrationFilePaths } from '../../../_internal/utils/command/migration.js'
import { bullet, table } from '../../../_internal/utils/log.js'
import { ENVS, get } from '../../../_internal/utils/process.js'

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
