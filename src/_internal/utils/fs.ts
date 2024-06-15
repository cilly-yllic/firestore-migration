import { readdirSync, readFileSync, statSync } from 'fs'

import { isJson } from 'my-gadgetry/type-check'

import { AppClass } from './app.js'
import { labeledBullet, labeledSuccess } from './log.js'

export const readJsonFileSync = (path: string, encode: BufferEncoding = 'utf-8') => {
  const json = isJson(readFileSync(path, encode))
  if (!json) {
    return {}
  }
  return json
}

export const getFiles = (dir: string, _files: string[] = []) => {
  const files = readdirSync(dir)
  for (const file of files) {
    const name = dir + '/' + file
    if (statSync(name).isDirectory()) {
      getFiles(name, _files)
    } else {
      _files.push(name)
    }
  }
  return _files
}

export const execFile = async (app: AppClass, filepath: string, method: string) => {
  labeledBullet(method, filepath)
  const script = await import(filepath)
  if (!script || !(method in script) || !(script[method] instanceof Function)) {
    throw Error('migrate method might be not function.')
  }
  await script[method]({
    app,
    firestore: app.firestore,
    settings: app.settings,
    options: app.options,
  })
  labeledSuccess(method, filepath)
}
