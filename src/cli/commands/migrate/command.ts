import { Command as Program } from 'commander'

import { MigrateOptions } from '../../../internal/types/options.js'
import { CommandClass } from '../../../internal/utils/command.js'

import { action } from './action.js'

export const init = (program: Program) => {
  new CommandClass<MigrateOptions>(program)
    .command('migrate')
    .option('--project <project>', 'target project (default) emulator')
    .action(options => {
      return action(options)
    })
}
