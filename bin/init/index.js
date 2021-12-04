const { createFolder } = require('../../libs/utils.js')
const file = require('../../libs/files.js')
const { join } = require('path')

function init() {
  return new Promise(async (resolve, reject) => {

    try {
      createFolder(join(process.cwd(), '.cdep'))
      createFolder(join(process.cwd(), '.cdep', 'data'))
      createFolder(join(process.cwd(), '.cdep', 'keys'))

      file.writePass()
      resolve("File created")

    } catch (error) {
      reject(error.message)
    }
  })
}

module.exports = init
