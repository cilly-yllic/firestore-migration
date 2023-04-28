import { Command as Program } from 'commander'

import { action } from './action.js'
import { CommandClass } from '../../../internal/utils/command.js'

export const init = (program: Program) => {
  new CommandClass(program)
    .command('migrate')
    .option("--project <project>", 'only target migrate file')
    .option("--only <targets>", 'only target migrate file')
    .action((options) => {
      return action(options);
    })
}