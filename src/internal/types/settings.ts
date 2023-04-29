import { AppOptions } from './app.js'

interface Ports {
  auth: string
  firestore: string
  storage: string
}
export interface Emulator {
  options: AppOptions
  name: string
  ports: Ports
}
export interface Settings {
  emulator: Emulator
  credentialPaths: {
    [project: string]: string
  }
  collectionName: string
  fileDirectoryPath: string
  aliases: {
    [filepath: string]: string
  }
}

export interface RcSettings extends Partial<Omit<Settings, 'emulator'>> {
  emulator?: {
    options?: AppOptions
    name?: string
    ports?: Partial<Ports>
  }
}
