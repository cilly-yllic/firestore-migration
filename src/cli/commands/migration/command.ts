import { Command as Program } from 'commander'

import { MigrateOptions } from '../../../_internal/types/options.js'
import { CommandClass } from '../../../_internal/utils/command.js'

import { action } from './action.js'

const setAliases = (commandClass: CommandClass<MigrateOptions>) => {
  commandClass
    .description('This command is used to migrate')
    .optionProject()
    .action(options => {
      return action(options)
    })
}

const commands = ['migration', 'migrate', 'm']

export const init = (program: Program) => {
  for (const command of commands) {
    setAliases(new CommandClass<MigrateOptions>(program).command(command))
  }
}
