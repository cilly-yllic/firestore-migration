import { ActionArg } from '../../../internal/types/command.js'
import { MigrateOptions } from '../../../internal/types/options.js'
import { AppClass } from '../../../internal/utils/app.js'
import { get as getMigrations, create as createMigration } from '../../../internal/utils/firestore/migrations.js'
import { FirestoreClass } from '../../../internal/utils/firestore.js'
import { getFiles, execFile } from '../../../internal/utils/fs.js'
import { bullet, table, labeledBullet } from '../../../internal/utils/log.js'
import { getFullPath } from '../../../internal/utils/path.js'
import { IS_DEBUG } from '../../../internal/utils/process.js'

const replaceFilepath = (filepath: string, regExp: RegExp) => filepath.replace(regExp, '').replace(/\.[jt]s$/, '')

const getMigrationFiles = async (firestore: FirestoreClass) => {
  const { directoryPath } = firestore.settings.migration
  const { migrations, batch } = await getMigrations(firestore)
  const fullPath = getFullPath(directoryPath)
  const filePaths = getFiles(fullPath)
  const FileRegExp = new RegExp(`^${fullPath}/`)
  return {
    filePaths: filePaths.filter(filepath => {
      // const name = filepath.replace(FileRegExp, '').replace(/\.[jt]s$/, '')
      const name = replaceFilepath(filepath, FileRegExp)
      labeledBullet('name', name)
      return migrations.every(migration => name !== migration.id)
    }),
    batch,
  }
}

const execFiles = (app: AppClass, filePaths: string[], batch: number) => {
  const { directoryPath } = app.settings.migration
  const FileRegExp = new RegExp(`^${getFullPath(directoryPath)}/`)
  return Promise.all(
    filePaths.map(async filepath => {
      await execFile(app, filepath, 'up')
      await createMigration(app.firestore, replaceFilepath(filepath, FileRegExp), batch)
    })
  )
}

export const action = async ({ app, firestore, options: _, settings: __ }: ActionArg<MigrateOptions>) => {
  const { filePaths, batch } = await getMigrationFiles(firestore)
  if (!filePaths.length) {
    bullet('nothing files to migrate')
  }
  if (IS_DEBUG) {
    bullet(`--- migrationFiles: ${filePaths.length} ---`)
    table(filePaths)
    return
  }
  return execFiles(app, filePaths, batch + 1)
}
