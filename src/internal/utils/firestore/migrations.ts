import { Timestamp, CollectionSnapshot } from '../../types/firestore.js'
import { FirestoreClass } from '../firestore.js'

export interface Migration {
  id: string
  batch: number
  createdAt: Timestamp
}

export const getSnapshots = (firestore: FirestoreClass): Promise<CollectionSnapshot> =>
  firestore.collection(firestore.settings.collectionName).get()

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

export const create = (firestore: FirestoreClass, id: string, batch: number) =>
  firestore.collection(firestore.settings.collectionName).doc(id).create({ batch, createdAt: new Date() })

export const clear = async (firestore: FirestoreClass) => {
  const snapshots = await getSnapshots(firestore)
  return firestore.deleteSnapshots(snapshots)
}
