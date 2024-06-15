import { Command as Program } from 'commander'

import { AlterOptions } from '../../../_internal/types/options.js'
import { CommandClass } from '../../../_internal/utils/command.js'

import { action } from './action.js'

const setAliases = (commandClass: CommandClass<AlterOptions>) => {
  commandClass
    .description('This command is used to exec target file.')
    .optionProject()
    .requiredOption('--only <target>', 'alter target file')
    .action(options => {
      return action(options)
    })
}

const commands = ['alter', 'a']

export const init = (program: Program) => {
  for (const command of commands) {
    setAliases(new CommandClass<AlterOptions>(program).command(command))
  }
}
