import { Command as Program } from 'commander'

import { MigrateOptions } from '../../../internal/types/options.js'
import { CommandClass } from '../../../internal/utils/command.js'

import { action } from './action.js'

const setAliases = (commandClass: CommandClass<MigrateOptions>) => {
  commandClass.option('-p, --project <project>', 'target project (default) emulator').action(options => {
    return action(options)
  })
}
export const init = (program: Program) => {
  setAliases(new CommandClass<MigrateOptions>(program).command('generation'))
  setAliases(new CommandClass<MigrateOptions>(program).command('migrate'))
  setAliases(new CommandClass<MigrateOptions>(program).command('m'))
}
