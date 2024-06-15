import { existsSync } from 'fs'

import admin from 'firebase-admin'

import { Options } from '../types/options.js'
import { Settings } from '../types/settings.js'

import { getFullPath } from './path.js'
import { get, ENVS } from './process.js'

export const init = (settings: Settings) => {
  if (!get(ENVS.IS_EMULATOR)) {
    return
  }
  const { auth, firestore, storage } = settings.emulator.ports
  if (auth) {
    process.env.FIREBASE_AUTH_EMULATOR_URL = `localhost:${auth}`
    process.env.FIREBASE_AUTH_EMULATOR_HOST = `127.0.0.1:${auth}`
  }
  if (firestore) {
    process.env.FIRESTORE_EMULATOR_HOST = `localhost:${firestore}`
  }
  if (storage) {
    process.env.FIREBASE_STORAGE_EMULATOR_HOST = `127.0.0.1:${storage}`
  }
}

export const initializeApp = async (settings: Settings, options: Options) => {
  if (get(ENVS.IS_EMULATOR)) {
    init(settings)
    const { options, name } = settings.emulator
    return name ? admin.initializeApp(options, name) : admin.initializeApp(options)
  } else {
    const credentialPath = settings.credentialPaths[options.project] || ''
    if (!credentialPath) {
      throw new Error('cannot read credential path.')
    }
    const path = getFullPath(credentialPath)
    if (!existsSync(path)) {
      throw new Error('credential path does not exist.')
    }
    const { default: credential } = await import(path, { assert: { type: 'json' } })
    return admin.initializeApp({ credential: admin.credential.cert(credential as any) })
  }
}
