
const fs = require('fs')
const { join } = require('path')
const { iv, passiv, logError, pass } = require('./utils')
const { writeCryptJson } = require('./function')

exports.writePass = async () => {

  let CONFIG_PATH = join(process.cwd(), '.cdep')

  fs.writeFileSync(join(CONFIG_PATH, 'keys', '.pass'), pass, (err) => { err && logError(err.message) })
  fs.writeFileSync(join(CONFIG_PATH, 'keys', '.iv.key'), iv, (err) => { err && logError(err.message) })
  fs.writeFileSync(join(CONFIG_PATH, 'keys', '.passiv.key'), passiv, (err) => { err && logError(err.message) })

  writeCryptJson({}, join(CONFIG_PATH, 'data', '.servers'))
  writeCryptJson({}, join(CONFIG_PATH, 'data', '.jobs'))

}