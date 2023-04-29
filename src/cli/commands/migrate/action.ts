import { ActionArg } from '../../../internal/types/command.js'
import { AppClass } from '../../../internal/utils/app.js'
import { get as getMigrations, create as createMigration } from '../../../internal/utils/firestore/migrations.js'
import { FirestoreClass } from '../../../internal/utils/firestore.js'
import { getFiles } from '../../../internal/utils/fs.js'
import { bullet, table, labeledBullet } from '../../../internal/utils/log.js'
import { getFullPath } from '../../../internal/utils/path.js'
import { IS_DEBUG } from '../../../internal/utils/process.js'

const replaceFilepath = (filepath: string, regExp: RegExp) => filepath.replace(regExp, '').replace(/\.[jt]s$/, '')

const getMigrationFiles = async (firestore: FirestoreClass) => {
  const { fileDirectoryPath } = firestore.settings
  const { migrations, batch } = await getMigrations(firestore)
  const fullPath = getFullPath(fileDirectoryPath)
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
  const { fileDirectoryPath } = app.settings
  const FileRegExp = new RegExp(`^${getFullPath(fileDirectoryPath)}/`)
  return Promise.all(
    filePaths.map(async filepath => {
      const method = await import(filepath)
      if (!method || !('exec' in method) || !(method.exec instanceof Function)) {
        throw Error('migrate method might be not function.')
      }
      await method.exec({
        app,
        firestore: app.firestore,
        settings: app.settings,
        options: app.options,
      })
      labeledBullet('migrate', filepath)
      await createMigration(app.firestore, replaceFilepath(filepath, FileRegExp), batch)
    })
  )
}

export const action = async ({ app, firestore, options: _, settings: __ }: ActionArg) => {
  const { filePaths, batch } = await getMigrationFiles(firestore)
  if (!filePaths.length) {
    bullet('nothing files to migrate')
  }
  if (IS_DEBUG) {
    bullet(`--- migrationFiles: ${filePaths.length} ---`)
    table(filePaths)
  }
  return execFiles(app, filePaths, batch + 1)
}
