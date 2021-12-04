#!/usr/bin/env node
const { Command } = require('commander')
const program = new Command();
const { prompt } = require('enquirer')
const { existsSync } = require('fs')

//Server cmd functions
const server_add = require('./server/add');
const init = require('./init');
const { logError, logSuccess } = require('../libs/utils');


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
  .command('add <server>')
  .description('Add new server configuration')
  .action((server) => {

  })

server
  .command('ls')
  .description('List all servers')
  .action(() => {

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
