export const DEFAULT_PROJECT = 'emulator'

export interface AlterOptions {
  project?: string
  only: string
}
export interface MigrateOptions {
  project?: string
}

export interface DefaultOptions {
  [key: string]: any
}

export type Options<T extends DefaultOptions = DefaultOptions> = T
