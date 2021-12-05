const ciqlJSON = require("ciql-json")
const { join } = require("path")
const { readCryptJson, writeCryptJson } = require("../../libs/function")
const { cwd } = require("process")


function rm(config) {
    return new Promise(async (resolveOK, reject) => {
        try {

            const data = ciqlJSON
                .create(readCryptJson(join(cwd(), ".cdep/data/.jobs")))
                .remove(config)
                .getData()

            writeCryptJson(data, join(cwd(), ".cdep/data/.jobs"))

            resolveOK("OK")
        } catch (error) {
            reject(error.message)
        }
    })
}

module.exports = rm
