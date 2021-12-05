const { join } = require("path")
const { writeCryptJson } = require("../../libs/function")
const { cwd } = require("process")


function clear() {
    return new Promise(async (resolveOK, reject) => {
        try {
            writeCryptJson({}, join(cwd(), ".cdep/data/.jobs"))
            resolveOK("OK")
        } catch (error) {
            reject(error.message)
        }
    })
}

module.exports = clear
