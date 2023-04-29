import { Command as Program } from 'commander'

import { GenerateOptions } from '../../../internal/types/options.js'
import { CommandClass } from '../../../internal/utils/command.js'

import { action } from './action.js'

const setAliases = (commandClass: CommandClass<GenerateOptions>) => {
  commandClass
    .requiredOption('-t, --type <file-type>', 'alter, a, migrate, migration, m')
    .requiredOption('-n, --name <filename>', 'filename')
    .action(options => {
      return action(options)
    })
}

export const init = (program: Program) => {
  setAliases(new CommandClass<GenerateOptions>(program).command('generate'))
  setAliases(new CommandClass<GenerateOptions>(program).command('g'))
}
