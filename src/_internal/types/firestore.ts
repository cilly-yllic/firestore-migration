import { firestore } from 'firebase-admin'

export type Firestore = firestore.Firestore
export type Timestamp = firestore.Timestamp
export type GeoPoint = firestore.GeoPoint
export type FieldPath = firestore.FieldPath
export type FieldValue = firestore.FieldValue
export type DocumentData = firestore.DocumentData
export type QueryDocumentSnapshot = firestore.QueryDocumentSnapshot
export type DocumentReference = firestore.DocumentReference
export type CollectionReference = firestore.CollectionReference
export type CollectionSnapshot = firestore.QuerySnapshot
export type DocumentSnapshot = firestore.DocumentSnapshot | firestore.QueryDocumentSnapshot
export type WriteBatch = firestore.WriteBatch
export type Snapshots = CollectionSnapshot | DocumentSnapshot[]
