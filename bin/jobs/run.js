const { resolve, basename } = require('path')
const { NodeSSH } = require('node-ssh')
const { logInfo, logError } = require("../../libs/utils")
const ssh = new NodeSSH()
const fs = require('fs');
const { join } = require('path');
const { cwd } = require('process');
const ciqlJSON = require("ciql-json");
const { readCryptJson } = require('../../libs/function');
const { exec } = require('child_process')


function run(job) {
  return new Promise(async (resolveOK, reject) => {
    try {


      const dataPathJob = join(cwd(), ".cdep", "data", ".jobs")
      const { jobName, prebuild, build, postdeploy, artefact, serverName, serverTargetPath, serverCmd } = ciqlJSON.create(readCryptJson(dataPathJob)).getData()[job]

      const dataPathServer = join(cwd(), ".cdep", "data", ".servers")
      const { host, port, user, pass } = ciqlJSON.create(readCryptJson(dataPathServer)).getData()[serverName]



      logInfo("Connecting to server ", serverName)
      ssh.connect({
        host: host,
        username: user,
        password: pass,
        port: port
      }).then(async () => {
        logInfo("run job", jobName)
        logInfo(`prebuild: '${prebuild}'`)
        exec(prebuild, { cwd: resolve(cwd()) }, async (err, stdout, stderr) => {
          if (err) {
            reject(err)
          } else {
            execBuild()
          }
        })
        function execBuild(params) {
          logInfo(`build: '${build}'`)
          exec(build, { cwd: resolve(cwd()) }, async (err, stdout, stderr) => {
            if (err) {
              reject(err)
            } else {
              sendArtefact()
            }
          })
        }


        function execCmd() {
          logInfo("execute on server", serverCmd)
          ssh.execCommand(serverCmd, { cwd: resolve(serverTargetPath), stream: 'stdout', options: { pty: true } })
            .then(function (result) {
              console.log(result.stdout);
              console.log(result.stderr);
              postDeploy()
              resolveOK("Application deployed to server" + serverName)
            })
            .catch(error => {
              logError(error);
              reject(error)
            })
        }
        function sendArtefact() {
          let ArttefactStats = fs.lstatSync(resolve(artefact))

          logInfo("get artefact", artefact)
          logInfo("Send artefact to server", serverName)

          if (ArttefactStats.isDirectory()) {
            logInfo("Artefact is directory")
            ssh.putDirectory(resolve(artefact), resolve(serverTargetPath),
              {
                recursive: true,
                concurrency: 10,
              })
              .then(() => { execCmd() })
              .catch(error => {
                console.error(error);
                reject(error)
              })
          } else {
            logInfo("Artefact is file")
            ssh.putFile(resolve(artefact), resolve(serverTargetPath, artefact))
              .then(() => { execCmd() })
              .catch(error => {
                console.error(error);
                reject(error)
              })
          }
        }

        function postDeploy(params) {
          logInfo(`post deploy '${postdeploy}'`)
          exec(postdeploy, { cwd: resolve(cwd()) }, async (err, stdout, stderr) => {
            if (err) {
              reject(err)
            }
          })
        }

      }).catch(error => {
        console.error(error);
        reject(error)
      })

    } catch (error) {
      console.error(error);
      reject(error)
    }
  })
}

module.exports = run
