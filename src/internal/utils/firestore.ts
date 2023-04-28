import admin from 'firebase-admin'

import { Firestore, DocumentReference, CollectionReference } from '../types/firestore.js'
import { Settings } from '../types/settings.js'
import { Options } from '../types/options.js'
import { BatchClass } from './firestore/batch.js'

export const getServerTimestamp = () => admin.firestore.FieldValue.serverTimestamp()
export const getDocumentId = () => admin.firestore.FieldPath.documentId()
export const getNow = () => admin.firestore.Timestamp.now()
export const getGeoPoint = (latitude: number, longitude: number): admin.firestore.GeoPoint => new admin.firestore.GeoPoint(latitude, longitude)
export const fromDate = (date: Date) => admin.firestore.Timestamp.fromDate(date)
export const addToArray = (...list: any[]) => admin.firestore.FieldValue.arrayUnion(...list)
export const deleteField = () => admin.firestore.FieldValue.delete()
export const documentPath = (...segments: string[]) => segments.join('/')

export const getFirestore = () => admin.firestore()
export const collectionGroup = (db: Firestore, path: string) => db.collectionGroup(path)
export const collection = (db: Firestore, path: string) => db.collection(path)
export const getCollection = (db: Firestore, path: string) => collection(db, path).get()
export const getCollectionGroup = (db: Firestore, path: string) => collectionGroup(db, path).get()
export const getDoc = (db: Firestore, path: string, id: string) => db.collection(path).doc(id).get()
export const create = (db: Firestore, path: string, id: string, value: any) => db.collection(path).doc(id).create(value)
export const add = (db: Firestore, path: string, value: any) => db.collection(path).add(value)
export const set = (db: Firestore, path: string, value: any) => db.doc(path).set(value)
export const update = (db: Firestore, path: string, value: any) => db.doc(path).update(value)
export const recursiveDelete = (db: Firestore, ref: DocumentReference | CollectionReference) => db.recursiveDelete(ref)
export const getBatch = (db: Firestore) => db.batch()

// ---- batch ----


export class FirestoreClass extends BatchClass {
  settings!: Settings
  options!: Options
  firestore: Firestore = getFirestore()
  
  constructor(settings: Settings, options: Options, fs?: Firestore) {
    super(fs || getFirestore())
    this.settings = settings
    this.options = options
    if (fs) {
      this.firestore = fs
    }
  }
  
  collectionGroup(path: string) {
    return collectionGroup(this.firestore, path)
  }
  
  collection(path: string) {
    return collection(this.firestore, path)
  }
  
  getCollection(path: string) {
    return getCollection(this.firestore, path)
  }
  
  getCollectionGroup(path: string) {
    return getCollectionGroup(this.firestore, path)
  }
  
  getDoc(path: string, id: string) {
    return getDoc(this.firestore, path, id)
  }
  
  create(path: string, id: string, value: any) {
    return create(this.firestore, path, id, value)
  }
  
  add(path: string, value: any) {
    return add(this.firestore, path, value)
  }
  
  set(path: string, value: any) {
    return set(this.firestore, path, value)
  }
  
  update(path: string, value: any) {
    return update(this.firestore, path, value)
  }
  
  recursiveDelete(path: string, ref: DocumentReference | CollectionReference) {
    return recursiveDelete(this.firestore, ref)
  }
}