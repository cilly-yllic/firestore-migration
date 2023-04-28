import { resolve, dirname, join } from 'path'
import { existsSync } from 'fs'
import { SETTING_FILE_NAME } from './configs.js'

export const getProjectRootPath = () => {
  const cwds = process.cwd().split(/\//g)
  let path = process.cwd()
  if (!existsSync(join(path, SETTING_FILE_NAME))) {
    for (const i in cwds) {
      path = join(path, '..')
      if (existsSync(join(path, SETTING_FILE_NAME))) {
        break
      }
    }
  }

  return path
}

export const getFullPath = (...path: string[]) => join(getProjectRootPath(), ...path)