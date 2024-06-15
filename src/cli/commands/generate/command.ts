import { Command as Program } from 'commander'

import { GenerateOptions } from '../../../_internal/types/options.js'
import { CommandClass } from '../../../_internal/utils/command.js'

import { action } from './action.js'

const setAliases = (commandClass: CommandClass<GenerateOptions>) => {
  commandClass
    .description('This command is used to generate template file.')
    .requiredOption('-t, --type <file-type>', 'alter, a, migrate, migration, m')
    .requiredOption('-n, --name <filename>', 'filename')
    .action(options => {
      return action(options)
    })
}

const commands = ['generate', 'g']

export const init = (program: Program) => {
  for (const command of commands) {
    setAliases(new CommandClass<GenerateOptions>(program).command(command))
  }
}
