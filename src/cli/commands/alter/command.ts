import { Command as Program } from 'commander'

import { AlterOptions } from '../../../internal/types/options.js'
import { CommandClass } from '../../../internal/utils/command.js'

import { action } from './action.js'

export const init = (program: Program) => {
  new CommandClass<AlterOptions>(program)
    .command('alter')
    .option('--project <project>', 'target project (default) emulator')
    .requiredOption('--only <target>', 'alter target file')
    .action(options => {
      return action(options)
    })
}
