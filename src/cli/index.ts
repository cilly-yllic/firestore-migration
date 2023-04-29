#!/usr/bin/env node
import { program } from 'commander'

import pkg from '../../package.json' assert { type: 'json' }
import { error } from '../internal/utils/log.js'

import { init } from './commands/index.js'

program.version(pkg.version)
await init(program)
program.action((_, args) => {
  const cmd = args[0]
  error(`${cmd} is not a Firebase command`)
  error('')
  error(`${cmd} has been renamed, please run instead`)
  console.log('exit')
  process.exit(1)
})
program.parse(process.argv)
