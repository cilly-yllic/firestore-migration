import { Command as Program } from 'commander'

const initCommand = async (filename: string, program: Program) => {
  ;(await import(`./${filename}/command.js`)).init(program)
}
export const init = async (program: Program) => {
  await initCommand('alter', program)
  await initCommand('generate', program)
  await initCommand('help', program)
  await initCommand('migration', program)
  await initCommand('migration-refresh', program)
  await initCommand('migration-rollback', program)
}
