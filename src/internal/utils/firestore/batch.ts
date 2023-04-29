import { Firestore, DocumentReference, DocumentSnapshot, Snapshots, WriteBatch } from '../../types/firestore.js'
import { chunk } from '../converters/array.js'

export const getBatch = (db: Firestore) => db.batch()

export interface SnapshotAndParam<T = any> {
  snapshot: DocumentSnapshot
  param: T
}

export const setSnapshots = (batch: WriteBatch, snapshots: SnapshotAndParam[], merge = false) => {
  snapshots.forEach(({ snapshot, param }) => {
    batch.set(snapshot.ref, param, { merge })
  })
  return batch.commit()
}

const updateOrCreateSnapshots = (batch: WriteBatch, snapshots: SnapshotAndParam[], createIfNotExists: boolean) => {
  snapshots.forEach(({ snapshot, param }) => {
    if (snapshot.exists) {
      batch.update(snapshot.ref, param)
    } else {
      if (!createIfNotExists) {
        return
      }
      batch.create(snapshot.ref, param)
    }
  })
  return batch.commit()
}

export const deleteRefs = (batch: WriteBatch, refs: DocumentReference[]) => {
  refs.forEach(ref => {
    batch.delete(ref)
  })
  return batch.commit()
}

export class BatchClass {
  firestore!: Firestore
  constructor(firestore: Firestore) {
    this.firestore = firestore
  }

  getBatch() {
    return getBatch(this.firestore)
  }

  updateOrCreateSnapshots(snapshots: SnapshotAndParam[], createIfNotExists = false) {
    return Promise.all(
      chunk<SnapshotAndParam>(snapshots, 100).map(chunked =>
        updateOrCreateSnapshots(this.getBatch(), chunked, createIfNotExists)
      )
    )
  }

  setSnapshots(snapshots: SnapshotAndParam[], merge = false) {
    return Promise.all(
      chunk<SnapshotAndParam>(snapshots, 100).map(chunked => setSnapshots(this.getBatch(), chunked, merge))
    )
  }

  deleteRefs(refs: DocumentReference[]) {
    return Promise.all(chunk<DocumentReference>(refs, 100).map(refs => deleteRefs(this.getBatch(), refs)))
  }

  deleteSnapshots(snapshots: Snapshots) {
    const documentRefs: DocumentReference[] = []
    snapshots.forEach(snapshot => {
      documentRefs.push(snapshot.ref)
    })
    return this.deleteRefs(documentRefs)
  }
}
