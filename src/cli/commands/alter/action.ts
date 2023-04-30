import { ActionArg } from '../../../internal/types/command.js'
import { AlterOptions } from '../../../internal/types/options.js'
import { Settings } from '../../../internal/types/settings.js'
import { AppClass } from '../../../internal/utils/app.js'
import { execFile } from '../../../internal/utils/fs.js'
import { bullet, table } from '../../../internal/utils/log.js'
import { getFullPath } from '../../../internal/utils/path.js'
import { ENVS, get } from '../../../internal/utils/process.js'

const getFilepath = (options: AlterOptions, settings: Settings) => {
  const { directoryPath } = settings.alter
  const targets = Object.entries(settings.alter.aliases).reduce((acc: string[], [key, paths]) => {
    if (key !== options.only) {
      return acc
    }
    for (const val of paths) {
      acc.push(getFullPath(directoryPath, val))
    }
    return acc
  }, [])
  return targets.length ? targets : [getFullPath(directoryPath, options.only)]
}

const execFiles = (app: AppClass, filePaths: string[]) => {
  return Promise.all(
    filePaths.map(async filepath => {
      await execFile(app, filepath, 'exec')
    })
  )
}

export const action = async ({ app, firestore: __, options, settings }: ActionArg<AlterOptions>) => {
  const filePaths = getFilepath(options, settings)
  if (!filePaths.length) {
    bullet('nothing files to alter')
  }
  if (get(ENVS.IS_DEBUG)) {
    bullet(`--- alter files: ${filePaths.length} ---`)
    table(filePaths)
    return
  }
  return execFiles(app, filePaths)
}
