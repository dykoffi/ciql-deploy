#!/usr/bin/env node
const { Command } = require('commander')
const program = new Command();
const { prompt } = require('enquirer')
const { existsSync } = require('fs')
const ciqlJSON = require("ciql-json")
const func = require('../libs/function');

const { cwd } = require('process')

const crypto = require('crypto');
const { join } = require('path');
const { logError, logSuccess, logInfo } = require('../libs/utils');


//Server cmd functions
const server_add = require('./server/add');
const server_ls = require('./server/ls');
const server_edit = require('./server/edit');
const server_clear = require('./server/clear');
const server_rm = require('./server/rm');

const init = require('./init');

const job_ls = require('./jobs/ls');
const job_clear = require('./jobs/clear');
const job_rm = require('./jobs/rm');

const initCmd = program
  .command('init')
  .description('Initialize config files')

const job = program
  .command('job')
  .description('Manage job configuration')

const server = program
  .command('server')
  .description('Manage Servers')



initCmd
  .action(() => {
    if (existsSync(".cdep")) {
      logError("This folder is already initialised with cdep")
      process.exit(0)
    }
    init()
      .then(mes => { logSuccess(mes) })
      .catch(err => { logError(err) })
      .finally(() => { process.exit(0) })
  })

server
  .command('add <server_name>')
  .description('Add new server configuration')
  .action((server_name) => {

    if (func.existServer(server_name)) {
      logError(server_name + "server already exist")
      process.exit(1)
    }
    func.verify(async () => {
      prompt([
        {
          type: "input",
          name: "host",
          message: "Host",
        },
        {
          type: "input",
          name: "port",
          message: "Port",
          initial: 22
        },
        {
          type: "input",
          name: "user",
          message: "User",
        },
        {
          type: "invisible",
          name: "password",
          message: "Password",
        }
      ])
        .then(({ host, port, user, password }) => {
          server_add(server_name, host, port, user, password)
            .then(mes => {
              logSuccess(mes)

              let identifiant = crypto.randomBytes(32).toString('base64')
              identifiant = "sv-" + identifiant

              let dataPath = join(cwd(), ".cdep", "data", ".servers")

              let data = ciqlJSON
                .create(func.readCryptJson(dataPath))
                .set(server_name, { id: identifiant, servername: server_name, host, port, user, pass: password })
                .getData()

              func.writeCryptJson(data, dataPath)
              logSuccess("Configuration saved")
            })
            .catch(err => { logError(err); process.exit(1) })
            .finally(() => { setTimeout(() => { process.exit(0) }, 1000) })
        })
        .catch((error) => { logError(error.message ? error.message : "broken") })

    })
  })


server
  .command("ls")
  .description("show all connected servers information")
  .action(() => {
    func.verify(() => {
      server_ls()
        .then()
        .catch(err => { logError(err); process.exit(1) })
        .finally(() => { setTimeout(() => { process.exit(0) }, 500) })
    })
  })

server
  .command('edit <server_name>')
  .description('Edit server configuration')
  .action((server_name) => {
    func.verify(() => {

      if (!func.existServer(server_name)) {
        logError(server_name, "server not found")
        process.exit(1)
      }

      const { servername, host, port, user, id, pass } = ciqlJSON
        .create(func.readCryptJson(join(cwd(), ".cdep/data/.servers")))
        .getData()[server_name]

      prompt([
        {
          type: "input",
          name: "servername",
          message: "Server name",
          initial: servername
        },
        {
          type: "input",
          name: "host",
          message: "Host",
          initial: host
        },
        {
          type: "input",
          name: "port",
          message: "Port",
          initial: port
        },
        {
          type: "input",
          name: "user",
          message: "User",
          initial: user
        },
        {
          type: "password",
          name: "password",
          message: "Password",
          initial: pass
        }

      ])
        .then(({ servername, host, port, user, password, }) => {
          server_edit(servername, host, port, user, password)
            .then(mes => {
              logSuccess(mes)

              let dataPath = join(cwd(), ".cdep", "data", ".servers")

              let data = ciqlJSON
                .create(func.readCryptJson(dataPath))
                .remove(server_name)
                .set(servername, { id, servername, host, port, user, pass: password })
                .getData()

              func.writeCryptJson(data, dataPath)

              if (server_name !== servername) {
                func.updatedJobsServerName(server_name, servername)
              }

              logSuccess("Server updated successfully")
            })
            .catch(err => { logError(err); process.exit(1) })
            .finally(() => { setTimeout(() => { process.exit(0) }, 1000) })
        })
        .catch((error) => { logError(error.message ? error.message : "broken") })

    })

  })

server
  .command('rm <server_name>')
  .description('Delete specify server')
  .action((server_name) => {
    if (!func.existServer(server_name)) {
      logError(server_name, "server not found")
      process.exit(1)
    }

    let nbJob = func.countServerJobs(server_name)

    if (nbJob > 0) {
      logError("you can't delete server", server_name)
      logInfo(nbJob, "job(s) depend on it")
      process.exit(1)
    }
    func.verify(() => {
      server_rm(server_name)
        .then(() => { logSuccess("Delete", server_name, "successfully") })
        .catch(err => { logError(err); process.exit(1) })
        .finally(() => { setTimeout(() => { process.exit(0) }, 500) })
    })
  })

server
  .command('copy <server1_name> <server2_name>')
  .description('Copy server config to another server')
  .action((server1_name, server2_name) => {
    func.verify(() => {
      if (!func.existServer(server1_name)) {
        logError(server1_name, "server not found")
        process.exit(1)
      }

      if (func.existServer(server2_name)) {
        logError(server2_name, "server already exist")
        process.exit(1)
      }

      try {

        const { host, port, user, pass } = ciqlJSON
          .create(func.readCryptJson(join(cwd(), ".cdep/data/.servers")))
          .getData()[server1_name]

        let dataPath = join(cwd(), ".cdep", "data", ".servers")

        let identifiant = crypto.randomBytes(32).toString('base64')
        identifiant = "sv-" + identifiant

        let data = ciqlJSON
          .create(func.readCryptJson(dataPath))
          .set(server2_name, { id: identifiant, servername: server2_name, host, port, user, pass })
          .getData()

        func.writeCryptJson(data, dataPath)
        logSuccess(server1_name, "Configuration copied to", server2_name, "successfully")

      } catch (error) {
        logError(error.message);
      }
    })
  })


server
  .command('clear')
  .description('Clear all servers data')
  .action(() => {
    func.verify(() => {
      server_clear()
        .then(() => { })
        .catch(err => { logError(err); process.exit(1) })
        .finally(() => { setTimeout(() => { process.exit(0) }, 500) })
    })

  })



job
  .command('add <job_name>')
  .description('add job')
  .action((job_name) => {
    func.verify(async () => {

      if (func.existJob(job_name)) {
        logError(job_name, "job already exist")
        process.exit(1)
      }

      if (func.countServers() === 0) {
        logError("You can't add job before server")
        logInfo("job depend on server")
        process.exit(1)
      }

      try {
        console.log();
        logInfo("on Local\n")
        let { prebuild, build, artefact, postdeploy } = await prompt([
          {
            type: "input",
            name: "prebuild",
            message: "Prebuild script",
          },
          {
            type: "input",
            name: "build",
            message: "Build script",
          },
          {
            type: "input",
            name: "artefact",
            message: "Artefacts",
          },
          {
            type: "input",
            name: "postdeploy",
            message: "Post deploy",
          },
        ])

        console.log();
        logInfo("Server information\n")

        const serversConfig = ciqlJSON
          .create(func.readCryptJson(join(process.cwd(), '.cdep', 'data', '.servers')))
          .remove('iat')
          .getKeys()

        let { serverName, targetPath, cmd } = await prompt([
          {
            type: "select",
            name: "serverName",
            message: "Chose server you want to connected",
            choices: serversConfig
          },
          {
            type: "input",
            name: "targetPath",
            message: "Target path",
          },
          {
            type: "input",
            name: "cmd",
            message: "Cmd",
          }
        ])

        let identifiant = crypto.randomBytes(32).toString('base64')
        identifiant = "sv-" + identifiant

        let dataPath = join(cwd(), ".cdep", "data", ".jobs")

        let data = ciqlJSON
          .create(func.readCryptJson(dataPath))
          .set(job_name, { id: identifiant, jobName: job_name, prebuild, build, postdeploy, artefact, serverName, serverTargetPath: targetPath, serverCmd: cmd })
          .getData()

        func.writeCryptJson(data, dataPath)
        logSuccess("Job saved successfully")

      } catch (error) {
        logError(error.message ? error.message : "broken")
      }
    })
  })

job
  .command("ls")
  .description("show all jobs information")
  .action(() => {
    func.verify(() => {
      job_ls()
        .then()
        .catch(err => { logError(err); process.exit(1) })
        .finally(() => { setTimeout(() => { process.exit(0) }, 500) })
    })
  })

job
  .command("rm <job_name>")
  .description("Delete specify job")
  .action((job_name) => {
    func.verify(() => {

      if (!func.existJob(job_name)) {
        logError(job_name, "job not found")
        process.exit(1)
      }

      job_rm(job_name)
        .then()
        .catch(err => { logError(err); process.exit(1) })
        .finally(() => { setTimeout(() => { process.exit(0) }, 500) })
    })
  })

job
  .command('clear')
  .description('Clean all servers data')
  .action((server) => {
    func.verify(() => {
      job_clear()
        .then(mes => { logSuccess("All job's configuration removed successfully") })
        .catch(err => { logError(err); process.exit(1) })
        .finally(() => { setTimeout(() => { process.exit(0) }, 500) })
    })

  })


job
  .command('copy <job1_name> <job2_name>')
  .description('Copy job config to another job')
  .action((job1_name, job2_name) => {
    func.verify(() => {

      if (!func.existJob(job1_name)) {
        logError(job1_name, "job not found")
        process.exit(1)
      }

      if (func.existJob(job2_name)) {
        logError(job2_name, "job already exist")
        process.exit(1)
      }

      try {

        const { prebuild, build, postdeploy, artefact, serverName, serverTargetPath, serverCmd } = ciqlJSON
          .create(func.readCryptJson(join(cwd(), ".cdep/data/.jobs")))
          .getData()[job1_name]

        let dataPath = join(cwd(), ".cdep", "data", ".jobs")

        let identifiant = crypto.randomBytes(32).toString('base64')
        identifiant = "sv-" + identifiant

        let data = ciqlJSON
          .create(func.readCryptJson(dataPath))
          .set(job2_name, { id: identifiant, jobName: job2_name, prebuild, build, postdeploy, artefact, serverName, serverTargetPath, serverCmd })
          .getData()

        func.writeCryptJson(data, dataPath)
        logSuccess(job1_name, "Configuration copied to", job2_name, "successfully")

      } catch (error) {
        logError(error.message);
      }
    })
  })

program.parse(process.args)
