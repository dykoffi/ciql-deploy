const { createFolder } = require('../../libs/utils.js')
const file = require('../../libs/files.js')
const { join } = require('path')

function init() {
  return new Promise(async (resolve, reject) => {

    createFolder(join(process.cwd(), '.cdep'))
    createFolder(join(process.cwd(), '.cdep', 'data'))
    createFolder(join(process.cwd(), '.cdep', 'keys'))

    file.writePass()

  })
}

module.exports = init
