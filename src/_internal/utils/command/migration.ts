import { AppClass } from '../app.js'
import { create as createMigration, get as getMigrations } from '../firestore/migrations.js'
import { FirestoreClass } from '../firestore.js'
import { execFile, getFiles } from '../fs.js'
import { labeledBullet } from '../log.js'
import { getFullPath, replaceFilepath } from '../path.js'

export const up = (app: AppClass, filePaths: string[], batch: number) => {
  const { directoryPath } = app.settings.migration
  const fileRegExp = new RegExp(`^${getFullPath(directoryPath)}/`)
  return Promise.all(
    filePaths.map(async (filepath, sort) => {
      await execFile(app, filepath, 'up')
      await createMigration(app.firestore, replaceFilepath(filepath, fileRegExp), batch, sort)
    })
  )
}

export const getFilePaths = async (firestore: FirestoreClass) => {
  const { directoryPath } = firestore.settings.migration
  const { migrations, batch } = await getMigrations(firestore)
  const fullPath = getFullPath(directoryPath)
  const filePaths = getFiles(fullPath)
  const fileRegExp = new RegExp(`^${fullPath}/`)
  return {
    filePaths: filePaths.filter(filepath => {
      // const name = filepath.replace(FileRegExp, '').replace(/\.[jt]s$/, '')
      const name = replaceFilepath(filepath, fileRegExp)
      labeledBullet('filename (migration)', name)
      return migrations.every(migration => name !== migration.id)
    }),
    batch,
  }
}
