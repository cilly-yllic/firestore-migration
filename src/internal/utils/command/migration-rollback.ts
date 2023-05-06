import { AppClass } from '../app.js'
import { deleteFile as deleteMigrationFile, getStepBatchDocuments } from '../firestore/migrations.js'
import { FirestoreClass } from '../firestore.js'
import { execFile, getFiles } from '../fs.js'
import { labeledBullet } from '../log.js'
import { getFullPath, replaceFilepath } from '../path.js'

export const down = (app: AppClass, filePaths: string[]) => {
  const { directoryPath } = app.settings.migration
  const fileRegExp = new RegExp(`^${getFullPath(directoryPath)}/`)
  return Promise.all(
    filePaths.map(async filepath => {
      await execFile(app, filepath, 'down')
      await deleteMigrationFile(app.firestore, replaceFilepath(filepath, fileRegExp))
    })
  )
}

export const getFilePaths = async (firestore: FirestoreClass, step = 0) => {
  const { directoryPath } = firestore.settings.migration
  const migrations = await getStepBatchDocuments(firestore, step)
  const fullPath = getFullPath(directoryPath)
  const filePaths = getFiles(fullPath)
  const fileRegExp = new RegExp(`^${fullPath}/`)
  const filenamePaths = filePaths.map(filepath => ({
    filepath,
    filename: replaceFilepath(filepath, fileRegExp),
  }))
  return migrations
    .filter(migration => {
      labeledBullet('filename (rollback)', migration.id)
      return filenamePaths.some(({ filename }) => migration.id === filename)
    })
    .map(migration => {
      return filenamePaths.find(({ filename }) => migration.id === filename)?.filepath as string
    })
}
