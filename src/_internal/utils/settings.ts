import { RcSettings, Settings, Aliases } from '../types/settings.js'

import { SETTING_FILE_NAME } from './configs.js'
import { getProjectRootPath } from './path.js'

export const DEFAULTS = {
  MIGRATION: {
    COLLECTION_NAME: 'migrations',
    DIRECTORY_PATH: 'migrations-files',
  },
  ALTER: {
    DIRECTORY_PATH: 'alter-files',
    ALIASES: {},
  },
}

const getEmulator = (emulator: RcSettings['emulator']): Settings['emulator'] => ({
  options: {
    ...(emulator?.options || {}),
  },
  name: emulator?.name || '',
  ports: {
    auth: emulator?.ports?.auth || '',
    firestore: emulator?.ports?.firestore || '',
    storage: emulator?.ports?.storage || '',
  },
})

const getCredentialPaths = (credentialPaths: RcSettings['credentialPaths']): Settings['credentialPaths'] =>
  credentialPaths || {}
const getAliases = (aliases?: Aliases): Settings['alter']['aliases'] => aliases || DEFAULTS.ALTER.ALIASES
export const parse = (settings: RcSettings): Settings => {
  return {
    emulator: getEmulator(settings?.emulator),
    credentialPaths: getCredentialPaths(settings?.credentialPaths),
    migration: {
      collectionName: settings.migration?.collectionName || DEFAULTS.MIGRATION.COLLECTION_NAME,
      directoryPath: settings.migration?.directoryPath || DEFAULTS.MIGRATION.DIRECTORY_PATH,
    },
    alter: {
      directoryPath: settings.alter?.directoryPath || DEFAULTS.ALTER.DIRECTORY_PATH,
      aliases: getAliases(settings.alter?.aliases),
    },
  }
}

export const getSettings = async () => {
  const { default: settings } = await import(`${getProjectRootPath()}/${SETTING_FILE_NAME}`)
  return parse(settings)
}
