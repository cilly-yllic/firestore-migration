import { Command as Program } from 'commander'

import { RefreshOptions } from '../../../_internal/types/options.js'
import { CommandClass } from '../../../_internal/utils/command.js'

import { action } from './action.js'

const setAliases = (commandClass: CommandClass<RefreshOptions>) => {
  commandClass
    .description('Rollback all migrations and then execute the migrate command.')
    .optionProject()
    .option('-s, --step <step>', 'You can rollback a specific number of migrations and then remigrate.', 0)
    .action(options => {
      return action(options)
    })
}

const migrations = ['migration', 'migrate', 'm']
const rollbacks = ['refresh', 'rf']
export const init = (program: Program) => {
  for (const m of migrations) {
    for (const r of rollbacks) {
      setAliases(new CommandClass<RefreshOptions>(program).command(`${m}:${r}`))
    }
  }
}
