import { App } from '../types/app.js'
import { Settings } from '../types/settings.js'
import { Options } from '../types/options.js'
import { FirestoreClass } from './firestore.js'
export class AppClass {
  settings!: Settings
  options!: Options
  app!: App
  public firestore!: FirestoreClass
  
  constructor(settings: Settings, options: Options, app: App) {
    this.settings = settings
    this.options = options
    this.app = app
    this.firestore = new FirestoreClass(settings, options, app.firestore())
  }
}