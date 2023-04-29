import { RcSettings, Settings } from '../types/settings.js'

import { SETTING_FILE_NAME } from './configs.js'
import { getProjectRootPath } from './path.js'

export const DEFAULT_COLLECTION_NAME = 'migrations'
export const DEFAULT_DIRECTORY_NAME = 'migrations-files'

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
const getAliases = (aliases: RcSettings['aliases']): Settings['aliases'] => aliases || {}
export const parse = (settings: RcSettings): Settings => {
  return {
    emulator: getEmulator(settings?.emulator),
    credentialPaths: getCredentialPaths(settings?.credentialPaths),
    collectionName: settings?.collectionName || DEFAULT_COLLECTION_NAME,
    fileDirectoryPath: settings?.fileDirectoryPath || DEFAULT_DIRECTORY_NAME,
    aliases: getAliases(settings?.aliases),
  }
}

export const getSettings = async () => {
  const { default: settings } = await import(`${getProjectRootPath()}/${SETTING_FILE_NAME}`)
  return parse(settings)
}
