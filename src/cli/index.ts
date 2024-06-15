#!/usr/bin/env node
import { program } from 'commander'

// import pkg from '../../package.json' assert { type: 'json' }
import { error } from '../_internal/utils/log.js'
import { get, ENVS, init } from '../_internal/utils/process.js'

import { init as initCommands } from './commands/index.js'

init()
program.version(`${get(ENVS.PACKAGE_VERSION)}`)
await initCommands(program)
program.action((_, args) => {
  const cmd = args[0]
  error(`${cmd} is not a Alfs command`)
  error('')
  error(`${cmd} has been renamed, please run instead`)
  console.log('exit')
  process.exit(1)
})
program.parse(process.argv)
