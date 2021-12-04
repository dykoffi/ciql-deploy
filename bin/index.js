#!/usr/bin/env node
const { Command } = require('commander')
const program = new Command();
const { prompt } = require('enquirer')
const { existsSync } = require('fs')
const ciqlJSON = require("ciql-json")
const func = require('../libs/function');

const crypto = require('crypto');
const { join } = require('path');
const { logError, logSuccess } = require('../libs/utils');


//Server cmd functions
const server_add = require('./server/add');
const server_ls = require('./server/ls');

const init = require('./init');



const initCmd = program
  .command('init')
  .description('Initialize config files')

const config = program
  .command('config')
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

              let dataPath = join(process.cwd(), ".cdep", "data", ".servers")

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
  .command('edit <server>')
  .description('Edit server configuration')
  .action((server) => {

  })

server
  .command('rm <server>')
  .description('Delete specify server')
  .action((server) => {

  })

server
  .command('copy <server1> <server2>')
  .description('Copy server config to another server')
  .action((server) => {

  })


server
  .command('clean')
  .description('Clean all servers data')
  .action((server) => {

  })


program.parse(process.args)
