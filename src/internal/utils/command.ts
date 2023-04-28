import { Command as Program, HelpContext } from 'commander'
import { AppClass } from './app.js'
import { Options } from '../types/options.js'
import { Settings } from '../types/settings.js'
import { Action, BeforeFunction, ActionArg } from '../types/command.js'
import { getSettings } from './settings.js'
import { initializeApp } from './initialize-app.js';
import { ENVS, set } from './process.js';

export class CommandClass {
  
  program!: Program
  private befores: BeforeFunction[] = [];
  private args!: ActionArg

  constructor(program: Program) {
    this.program = program
  }
  
  async init(options: Options, settings: Settings) {
    set(ENVS.IS_EMULATOR, options.project === 'emulator')
    const app = await initializeApp(settings, options)
    const appClass = new AppClass(settings, options, app)
    this.args = {
      options,
      settings,
      app: appClass,
      firestore: appClass.firestore,
    }
    return this
  }
  
  command(command: string) {
    this.program = this.program.command(command)
    return this
  }
  
  help(help: HelpContext): CommandClass {
    this.program = this.program.help(help)
    return this;
  }
  
  before(before: Action, ...args: any[]): CommandClass {
    this.befores.push({ fn: before, args: args });
    return this;
  }
  
  description(description: string): CommandClass {
    this.program = this.program.description(description)
    return this;
  }
  
  option(...args: any[]): CommandClass {
    const flags = args.shift();
    this.program = this.program.option(flags, ...args)
    return this;
  }
  
  action(action: Action) {
    this.program = this.program.action(async (...args) => {
      const options = args[0]
      await this.init(options, await getSettings())
      for (const before of this.befores) {
        await before.fn(options, ...before.args);
      }
      return action(this.args, ...args)
    })
  }
}