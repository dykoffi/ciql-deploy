const { join } = require("path")
const { writeCryptJson, countServerJobs, readCryptJson } = require("../../libs/function")
const { cwd } = require("process")
const ciqlJSON = require("ciql-json")
const { logSuccess, logWarning } = require("../../libs/utils")


function clear() {
    return new Promise(async (resolveOK, reject) => {
        try {
            const dataPath = join(cwd(), ".cdep/data/.servers")
            const serverNames = ciqlJSON.create(readCryptJson(dataPath)).remove("iat").getKeys()
            const tempServerData = ciqlJSON.create(readCryptJson(dataPath)).remove("iat").getData()

            serverNames.forEach((server) => {
                let nbJobs = countServerJobs(server)
                if (nbJobs > 0) {
                    logWarning(server, "can't be removed.", nbJobs, "jobs depend on it")
                } else {
                    delete tempServerData[server]
                    logSuccess(server, "removed successfully")
                }
            })

            let finalData = tempServerData;

            writeCryptJson(finalData, dataPath)
            resolveOK("OK")

        } catch (error) {
            reject(error.message)
        }
    })
}

module.exports = clear
