import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { fileURLToPath } from 'node:url'
import { join, dirname } from 'path'

import { ActionArg } from '../../../internal/types/command.js'
import { GenerateOptions, GENERATE_TYPES } from '../../../internal/types/options.js'
import { Settings } from '../../../internal/types/settings.js'
import { digits } from '../../../internal/utils/converters/number.js'
import { kebabCase } from '../../../internal/utils/converters/string.js'
import { labeledSuccess, labeledBullet, table } from '../../../internal/utils/log.js'
import { getFullPath } from '../../../internal/utils/path.js'
import { ENVS, get } from '../../../internal/utils/process.js'

const TEMPLATE_PATH = join(dirname(fileURLToPath(import.meta.url)), '../../../templates')
const ALTER_TEMPLATE_NAME = 'alter.ts.template'
const MIGRATION_TEMPLATE_NAME = 'migration.ts.template'

const getFilename = (name: string) => {
  const now = new Date()
  const year = now.getFullYear()
  const month = digits(now.getMonth() + 1) //months from 1-12
  const day = digits(now.getDate())
  const hours = digits(now.getHours())
  const minutes = digits(now.getMinutes())
  const seconds = digits(now.getSeconds())
  return `${year}-${month}-${day}-${hours}${minutes}${seconds}-${kebabCase(name)}`
}

const getTemplate = (path: string) => {
  return readFileSync(path, 'utf-8')
}

const writeTemplate = (path: string, name: string, file: string) => {
  const fullPath = getFullPath(path)
  mkdirSync(fullPath, { recursive: true })
  const filepath = join(fullPath, `${name}.ts`)
  if (existsSync(filepath)) {
    throw Error(`${filepath} already exists.`)
  }
  writeFileSync(filepath, file)
  labeledSuccess('file', `${filepath} generated.`)
  return
}

const generateAlterFile = (options: GenerateOptions, settings: Settings) => {
  return writeTemplate(
    settings.alter.directoryPath,
    getFilename(options.name),
    getTemplate(join(TEMPLATE_PATH, ALTER_TEMPLATE_NAME))
  )
}

const generateMigrationFile = (options: GenerateOptions, settings: Settings) => {
  return writeTemplate(
    settings.migration.directoryPath,
    getFilename(options.name),
    getTemplate(join(TEMPLATE_PATH, MIGRATION_TEMPLATE_NAME))
  )
}

export const action = async ({ options, settings }: ActionArg<GenerateOptions>) => {
  const { type, name } = options
  labeledBullet(`generate: ${type}`, `${name}`)
  switch (type) {
    case GENERATE_TYPES.a:
    case GENERATE_TYPES.alter:
      table({
        type: { Value: type },
        name: { Value: name },
        directoryPath: { Value: settings.alter.directoryPath },
      })
      if (get(ENVS.IS_DEBUG)) {
        return
      }
      return generateAlterFile(options, settings)
    case GENERATE_TYPES.m:
    case GENERATE_TYPES.migrate:
    case GENERATE_TYPES.migration:
      table({
        type: { Value: type },
        name: { Value: name },
        directoryPath: { Value: settings.migration.directoryPath },
      })
      if (get(ENVS.IS_DEBUG)) {
        return
      }
      return generateMigrationFile(options, settings)
  }
}
