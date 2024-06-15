import { Timestamp, CollectionSnapshot } from '../../types/firestore.js'
import { getMultiSort } from '../converters/array.js'
import { FirestoreClass } from '../firestore.js'

export interface Migration {
  id: string
  batch: number
  sort: number
  createdAt: Timestamp
}

const getRef = (firestore: FirestoreClass) => firestore.collection(firestore.settings.migration.collectionName)
export const getSnapshots = (firestore: FirestoreClass): Promise<CollectionSnapshot> => getRef(firestore).get()

export const get = async (
  firestore: FirestoreClass
): Promise<{ migrations: Migration[]; batch: Migration['batch'] }> => {
  const snapshots = await getSnapshots(firestore)
  const migrations: Migration[] = []
  snapshots.forEach(snapshot => {
    migrations.push({ ...snapshot.data(), id: snapshot.id } as Migration)
  })
  const batch = migrations.reduce((acc, migration) => Math.max(acc, migration.batch || 0), -1)
  return {
    migrations,
    batch,
  }
}

export const getStepBatchDocuments = async (firestore: FirestoreClass, step = 0) => {
  const snapshots = await getRef(firestore).get()
  if (snapshots.size <= 0) {
    throw Error(`There are no document data in the ${firestore.settings.migration.collectionName} collection.`)
  }
  const migrations: Migration[] = []
  snapshots.forEach(snapshot => {
    migrations.push({ ...snapshot.data(), id: snapshot.id } as Migration)
  })
  const sortedMigrations = getMultiSort<Migration>(migrations, [
    { key: 'batch', order: 'DESC' },
    { key: 'sort', order: 'DESC' },
  ])
  if (step <= 0) {
    return sortedMigrations
  }
  const batch = sortedMigrations[0].batch - (step - 1)
  if (batch < 0) {
    throw Error(
      `The specified step number (${step}) exceeds the maximum batch size (${
        sortedMigrations[0].batch + 1
      }) of the migration.`
    )
  }
  return sortedMigrations.filter(migration => migration.batch >= batch)
}

export const create = (firestore: FirestoreClass, id: string, batch: number, sort: number) =>
  firestore
    .collection(firestore.settings.migration.collectionName)
    .doc(id)
    .create({ batch, sort, createdAt: new Date() })

export const deleteFile = (firestore: FirestoreClass, id: string) =>
  firestore.collection(firestore.settings.migration.collectionName).doc(id).delete()

export const clear = async (firestore: FirestoreClass) => {
  const snapshots = await getSnapshots(firestore)
  return firestore.deleteSnapshots(snapshots)
}
