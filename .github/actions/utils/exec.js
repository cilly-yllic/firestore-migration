import * as exec from '@actions/exec'

export const execute = async command => {
  let log = ''
  const options = {
    listeners: {
      stdout: data => {
        log += data.toString()
      },
      stderr: data => {
        log += data.toString()
      },
    },
  }
  await exec.exec(command, null, options)
  return log
}
