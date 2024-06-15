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

export interface Aliases {
  [filepath: string]: string[]
}
export interface Settings {
  emulator: Emulator
  credentialPaths: {
    [project: string]: string
  }
  migration: {
    collectionName: string
    directoryPath: string
  }
  alter: {
    directoryPath: string
    aliases: Aliases
  }
}

export interface RcSettings extends Partial<Omit<Settings, 'emulator'>> {
  emulator?: {
    options?: AppOptions
    name?: string
    ports?: Partial<Ports>
  }
}
