
const { existsSync, mkdirSync } = require('fs')
const crypto = require('crypto');
const { resolve } = require('path');
const chalk = require('chalk');

const iv = crypto.randomBytes(16).toString('base64')
const passiv = crypto.randomBytes(32).toString('base64')
const pass = crypto.randomBytes(32).toString('base64')



function createFolder(name) {
  if (!existsSync(resolve(name))) {
    mkdirSync(resolve(name))
  }
}

function crypt(data, algorithm, passiv, iv) {
  let cipher = crypto.createCipheriv(algorithm, passiv, iv)
  let crypted = cipher.update(data, 'utf8', 'hex')
  crypted += cipher.final('hex');
  return crypted;
}

exports.dcrypt = function (data, algorithm, passiv, iv) {
  var decipher = crypto.createDecipheriv(algorithm, passiv, iv)
  var dec = decipher.update(data, 'hex', 'utf8')
  dec += decipher.final('utf8');
  return dec;
}

function logError(...message) { console.error(chalk.bold.red("Failed"), ":", ...message); }
function logSuccess(...message) { console.log(chalk.bold.green("Success"), ":", ...message); }
function logInfo(...message) { console.log(chalk.bold.blueBright("Info"), ":", ...message); }
function logWarning(...message) { console.log(chalk.bold.yellow("Warning"), ":", ...message); }



exports.logError = logError
exports.logSuccess = logSuccess
exports.logInfo = logInfo
exports.logWarning = logWarning

exports.algo = "aes-256-ctr"

exports.createFolder = createFolder
exports.iv = iv
exports.passiv = passiv
exports.pass = pass
exports.crypt = crypt