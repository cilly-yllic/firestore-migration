export const DEFAULT_PROJECT = 'emulator'

export interface AlterOptions {
  project?: string
  only: string
}

export const GENERATE_TYPES = {
  alter: 'alter',
  a: 'a',
  migration: 'migration',
  migrate: 'migrate',
  m: 'm',
} as const

export type GenerateType = (typeof GENERATE_TYPES)[keyof typeof GENERATE_TYPES]
export interface GenerateOptions {
  type: GenerateType
  name: string
}
export interface MigrateOptions {
  project?: string
}

export interface DefaultOptions {
  [key: string]: any
}

export type Options<T extends DefaultOptions = DefaultOptions> = T
