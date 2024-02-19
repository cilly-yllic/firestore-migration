import * as core from '@actions/core'
import { execute } from '../utils/exec.js'

const run = async () => {
  const version = await execute('jq -r .version package.json')
  core.setOutput('tag-name', version.trim())
}

run()
