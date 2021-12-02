
const { existsSync, mkdirSync } = require('fs')
const crypto = require('crypto');
const generator = require('generate-password');
const { resolve } = require('path');
const chalk = require('chalk');

const passphrase = generator.generate({
  length: 255,
  uppercase: false,
  symbols: true,
  numbers: true
});

const iv = crypto.randomBytes(16).toString('base64')
const passiv = crypto.randomBytes(32).toString('base64')

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,  // the length of your key in bits
  publicKeyEncoding: {
    type: 'spki',       // recommended to be 'spki' by the Node.js docs
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',      // recommended to be 'pkcs8' by the Node.js docs
    format: 'pem',
    cipher: 'aes-256-cbc',   // *optional*
    passphrase: passphrase // *optional*
  }
});

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
exports.privateKey = privateKey
exports.publicKey = publicKey
exports.passphrase = passphrase
exports.iv = iv
exports.passiv = passiv
exports.crypt = crypt