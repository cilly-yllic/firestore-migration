import { Command as Program } from 'commander'

import { RollbackOptions } from '../../../_internal/types/options.js'
import { CommandClass } from '../../../_internal/utils/command.js'

import { action } from './action.js'

const setAliases = (commandClass: CommandClass<RollbackOptions>) => {
  commandClass
    .description('This command is used to rollback the previous step.')
    .optionProject()
    .option('-s, --step <step>', 'You can rollback a specific number of migrations and then remigrate.', 0)
    .action(options => {
      return action(options)
    })
}

const migrations = ['migration', 'migrate', 'm']
const rollbacks = ['rollback', 'back', 'rb']
export const init = (program: Program) => {
  for (const m of migrations) {
    for (const r of rollbacks) {
      setAliases(new CommandClass<RollbackOptions>(program).command(`${m}:${r}`))
    }
  }
}
