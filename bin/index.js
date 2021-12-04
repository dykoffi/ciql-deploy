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
const { logError, logSuccess } = require('../libs/utils');


//Server cmd functions
const server_add = require('./server/add');
const server_ls = require('./server/ls');
const server_edit = require('./server/edit');
const server_clear = require('./server/clear');
const server_rm = require('./server/rm');

const init = require('./init');



const initCmd = program
  .command('init')
  .description('Initialize config files')

const processCmd = program
  .command('process')
  .description('Manage configuration')

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
        .catch(reason => { logError("Broken") })

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
      const configs = ciqlJSON.create(func.readCryptJson(join(cwd(), ".cdep/data/.servers"))).getKeys()
      if (!configs.includes(server_name)) {
        logError(server_name + " config not found")
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
              logSuccess("Configuration saved")
            })
            .catch(err => { logError(err); process.exit(1) })
            .finally(() => { setTimeout(() => { process.exit(0) }, 1000) })
        })
        .catch((err) => { logError(err.message) })

    })

  })

server
  .command('rm <server_name>')
  .description('Delete specify server')
  .action((server_name) => {
    func.verify(() => {
      server_rm(server_name)
      .then()
      .catch(err => { logError(err); process.exit(1) })
      .finally(() => { setTimeout(() => { process.exit(0) }, 500) })
    })
  })

server
  .command('copy <server1> <server2>')
  .description('Copy server config to another server')
  .action((server) => {
    func.verify(() => {

    })
  })


server
  .command('clear')
  .description('Clean all servers data')
  .action((server) => {
    func.verify(() => {
      server_clear()
        .then(mes => { logSuccess("All server's config removed") })
        .catch(err => { logError(err); process.exit(1) })
        .finally(() => { setTimeout(() => { process.exit(0) }, 500) })
    })

  })


program.parse(process.args)
