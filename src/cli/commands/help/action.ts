import { cyan } from 'colorette'

import { ActionArg } from '../../../_internal/types/command.js'
import { AlterOptions } from '../../../_internal/types/options.js'
import { logger } from '../../../_internal/utils/logger.js'
import { get, ENVS } from '../../../_internal/utils/process.js'

const ASCII_ART = `
     ___   _       _____   _____
    /   | | |     |  ___| /  ___/
   / /| | | |     | |__   | |___
  / / | | | |     |  __|  \\___  \\
 / /  | | | |___  | |      ___| |
/_/   |_| |_____| |_|     /_____/
    `

const VERSIONS = `
  Alter Firestore: ${get(ENVS.PACKAGE_VERSION)}
  Node: ${process.versions.node}
  OS: ${process.platform} ${process.arch}
  `

const show = () => {
  logger.info(
    ASCII_ART.split('\n')
      .map(x => cyan(x))
      .join('\n')
  )
  logger.info(VERSIONS)
}

export const action = async (_: ActionArg<AlterOptions>) => {
  show()
  // TODO
  return
}
