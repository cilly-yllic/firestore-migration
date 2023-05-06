import { readdirSync, statSync } from 'fs'

import { AppClass } from './app.js'
import { labeledBullet, labeledSuccess } from './log.js'

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
