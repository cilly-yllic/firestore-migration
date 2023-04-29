import { Command as Program } from 'commander'

import { AlterOptions } from '../../../internal/types/options.js'
import { CommandClass } from '../../../internal/utils/command.js'

import { action } from './action.js'

const setAliases = (commandClass: CommandClass<AlterOptions>) => {
  commandClass
    .option('-p, --project <project>', 'target project (default) emulator')
    .requiredOption('--only <target>', 'alter target file')
    .action(options => {
      return action(options)
    })
}
export const init = (program: Program) => {
  setAliases(new CommandClass<AlterOptions>(program).command('alter'))
  setAliases(new CommandClass<AlterOptions>(program).command('a'))
}
