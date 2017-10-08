import childProcess from 'child_process'

/**
 * process manager
 *
 * @class Process
 */
class Process {
  /**
   * Win32 operating system
   *
   * @memberof Process
   */
  isWin32 = false
  /**
   * Unix operating system
   *
   * @memberof Process
   */
  isUnix = false
  constructor () {
    this.isWin32 = process.platform === 'win32'
    this.isUnix = !this.isWin32
  }
  /**
   * find process info by port
   *
   * @param {(number|string)} port - port
   * @returns {(object|null)} - {cmd, pid, user}
   * @memberof Process
   */
  async findByPort (port) {
    if (this.isWin32) {

    } else if (this.isUnix) {
      let res = await new Promise(resolve => {
        childProcess.exec(`lsof -i:${port}`, (err, stdout, stderr) => {
          if (err) resolve(null)
          else if (stdout) {
            stdout = stdout.split('\n')
            if (stdout.length > 1) {
              let proc = stdout[1].trim().split(/\s+/)
              resolve({
                cmd: proc[0],
                pid: proc[1],
                user: proc[2]
              })
            } else resolve(null)
          } else resolve(null)
        })
      })
      return res
    } else return null
  }
  /**
   * kill process by pid
   *
   * @param {(number|string)} pid - process's pid
   * @returns {boolean} - success or failed
   * @memberof Process
   */
  async killByPid (pid) {
    if (this.isWin32) {
    } else if (this.isUnix) {
      let res = await new Promise(resolve => {
        childProcess.exec(`kill ${pid}`, (err, stdout, stderr) => {
          if (err) resolve(false)
          else resolve(true)
        })
      })
      return res
    }
  }
}

const process_ = new Process()

export default process_
